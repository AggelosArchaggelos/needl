import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { validateContent } from './validate-content.mjs';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
async function load(file, overrides={}, environment={}) {
 const code=ts.transpileModule(await fs.readFile(path.join(root,file),'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const exports={};
 vm.runInNewContext(code,{exports,Buffer,URL,Date,process:{env:environment,cwd:()=>environment.cwd??root},require:id=>Object.hasOwn(overrides,id)?overrides[id]:require(id)});
 return exports;
}
class JsonResponse extends Response { static json(body,init) { return new JsonResponse(JSON.stringify(body),init); } }
test('local workspace rejects remote origins and production access; backs up and applies only validated data',async()=>{
 const temporary=await fs.mkdtemp(path.join(os.tmpdir(),'needl-workspace-test-'));
 try {
  await fs.mkdir(path.join(temporary,'content'));
  for(const name of ['studios','news','cities','styles','site-config']) await fs.copyFile(path.join(root,'content',name+'.json'),path.join(temporary,'content',name+'.json'));
  const shape=await load('lib/draft-workspace.ts');
  const dependencies={'next/server':{NextResponse:JsonResponse},'@/lib/draft-workspace':shape,'@/scripts/validate-content.mjs':{validateContent}};
  const route=await load('app/api/local-workspace/route.ts',dependencies,{NODE_ENV:'development',cwd:temporary});
  const workspace={version:1,studios:JSON.parse(await fs.readFile(path.join(temporary,'content/studios.json'))),news:JSON.parse(await fs.readFile(path.join(temporary,'content/news.json')))};
  const request=(action,origin='http://localhost:3210')=>new Request('http://localhost:3210/api/local-workspace',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({action,workspace})});
  assert.equal((await route.POST(request('backup','https://example.com'))).status,404);
  const prod=await load('app/api/local-workspace/route.ts',dependencies,{NODE_ENV:'production',cwd:temporary});
  assert.equal((await prod.POST(request('backup'))).status,404);
  const original=await fs.readFile(path.join(temporary,'content/studios.json'),'utf8');
  workspace.studios[0].name='';
  assert.equal((await route.POST(request('backup'))).status,200);
  assert.equal((await route.POST(request('apply'))).status,422);
  assert.equal(await fs.readFile(path.join(temporary,'content/studios.json'),'utf8'),original);
  workspace.studios[0].name='Local test studio';
  const applied=await route.POST(request('apply'));assert.equal(applied.status,200);
  const body=await applied.json();
  assert.equal(await fs.readFile(path.join(temporary,'.local-data',body.backup,'studios.json'),'utf8'),original);
  assert.equal(JSON.parse(await fs.readFile(path.join(temporary,'content/studios.json')))[0].name,'Local test studio');
 } finally { const resolved=path.resolve(temporary); assert.equal(path.dirname(resolved),path.resolve(os.tmpdir())); assert.ok(path.basename(resolved).startsWith("needl-workspace-test-")); await fs.rm(resolved,{recursive:true,force:true}); }
});
test('pricing tokens reject tampering, missing configuration and expiry',async()=>{
 const dependencies={'server-only':{}};
 const access=await load('lib/pricing-access.ts',dependencies,{NODE_ENV:'production',STUDIO_ACCESS_SECRET:'test-only-not-a-real-secret-1234567890'});
 const token=access.issuePricingAccess();assert.equal(access.hasPricingAccess(token),true);assert.equal(access.hasPricingAccess(token+'x'),false);assert.equal(access.hasPricingAccess(),false);
 const disabled=await load('lib/pricing-access.ts',dependencies,{NODE_ENV:'production'});assert.equal(disabled.hasPricingAccess(token),false);assert.throws(()=>disabled.issuePricingAccess());
 const crypto=require('node:crypto');
 const payload=Buffer.from(JSON.stringify({scope:'studio-pricing',expires:0})).toString('base64url');
 const expired=payload+'.'+crypto.createHmac('sha256','test-only-not-a-real-secret-1234567890').update(payload).digest('base64url');
 assert.equal(access.hasPricingAccess(expired),false);
});
