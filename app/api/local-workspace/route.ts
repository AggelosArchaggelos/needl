import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isDraftWorkspace } from "@/lib/draft-workspace";
import { validateContent } from "@/scripts/validate-content.mjs";

export const runtime = "nodejs";
const folder = path.join(process.cwd(), ".local-data");
const headers = { "Cache-Control": "no-store" };
let busy = false;
function allowed(request: Request, write = false) {
  if (process.env.NODE_ENV !== "development") return false;
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return false;
  return !write || request.headers.get("origin") === url.origin;
}
export async function GET(request: Request) {
  if (!allowed(request)) return new NextResponse(null, { status: 404 });
  try { return NextResponse.json(JSON.parse(await fs.readFile(path.join(folder,"drafts.json"),"utf8")), { headers }); }
  catch { return NextResponse.json({error:"No local backup found."}, { status:404, headers }); }
}
export async function POST(request: Request) {
  if (!allowed(request,true)) return new NextResponse(null,{status:404});
  if (busy) return NextResponse.json({error:"Another save is running. Try again."},{status:409,headers});
  busy=true;
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({error:"Expected JSON."},{status:400,headers});
    const raw = await request.text();
    if (Buffer.byteLength(raw)>2_000_000) return NextResponse.json({error:"Draft is too large. Use image URLs, not embedded photos."},{status:413,headers});
    let body; try { body=JSON.parse(raw); } catch { return NextResponse.json({error:"Invalid JSON."},{status:400,headers}); }
    if (!body || !isDraftWorkspace(body.workspace) || !["backup","apply"].includes(body.action)) return NextResponse.json({error:"Invalid draft format."},{status:400,headers});
    await fs.mkdir(folder,{recursive:true});
    const draftFile=path.join(folder,"drafts.json");
    // Preserve previous disk drafts before replacing them.
    try { await fs.copyFile(draftFile,path.join(folder,"drafts-"+Date.now()+"-"+randomUUID()+".json")); } catch (err) { if ((err as NodeJS.ErrnoException).code!=="ENOENT") throw err; }
    const temp=path.join(folder,"draft-"+randomUUID()+".tmp");
    await fs.writeFile(temp,JSON.stringify(body.workspace,null,2)); await fs.rename(temp,draftFile);
    if(body.action==="backup") return NextResponse.json({ok:true},{headers});
    const content=path.join(process.cwd(),"content");
    const read=async(name:string)=>JSON.parse(await fs.readFile(path.join(content,name+".json"),"utf8"));
    const trash=new Set(body.workspace.trash??[]);
    const studios=body.workspace.studios.filter((s:{id:string})=>!trash.has("studios:"+s.id));
    const news=body.workspace.news.filter((n:{id:string})=>!trash.has("news:"+n.id));
    const issues=validateContent({studios,news,cities:await read("cities"),styles:await read("styles"),config:await read("site-config")});
    if(issues.some(i=>i.level==="ERROR")) return NextResponse.json({error:"Fix content errors before applying. Your disk draft was saved.",issues},{status:422,headers});
    const checkpoint=path.join(folder,"content-backup-"+Date.now()+"-"+randomUUID());
    await fs.mkdir(checkpoint);
    const names=["studios","news"];
    for(const name of names) await fs.copyFile(path.join(content,name+".json"),path.join(checkpoint,name+".json"));
    try {
      for(const [name,data] of [["studios",studios],["news",news]] as const) {
        const file=path.join(content,name+".json"); const temporary=file+".local-tmp";
        await fs.writeFile(temporary,JSON.stringify(data,null,2)+"\n"); await fs.rename(temporary,file);
      }
    } catch(err) {
      for(const name of names) await fs.copyFile(path.join(checkpoint,name+".json"),path.join(content,name+".json"));
      throw err;
    }
    return NextResponse.json({ok:true,backup:path.basename(checkpoint),warnings:issues.filter(i=>i.level!=="ERROR").length},{headers});
  } catch { return NextResponse.json({error:"Local save failed. Check disk space and permissions; backups are kept in .local-data."},{status:500,headers}); }
  finally { busy=false; }
}
