import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=JSON.parse(read('content/styles.json'));
function load(file,extra={}){const exports={};vm.runInNewContext(ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,URL,Response,Request,TextDecoder,AbortSignal,process:{env:{}},...extra});return exports;}
const engine=load('lib/style-finder.ts');
const predict=s=>engine.previewStyles(s,'en',catalog);
test('keyword preview handles bilingual visual cues, combinations and subject-only ambiguity',()=>{
 assert.equal(predict('An olive branch with thin black lines, no colour.').matches[0].id,'fine-line');
 assert.equal(engine.previewStyles('Ένα κλαδί με λεπτές γραμμές.','el',catalog).matches[0].id,'fine-line');
 assert.ok(predict('I want a dragon').question);
 assert.equal(predict('I want a dragon').matches.length,0);
 assert.equal(predict('geometric shapes and dotwork').matches.length,2);
 assert.equal(predict('A neotraditional owl').matches[0].id,'neo-traditional');
 assert.ok(!predict('A neo-traditional owl').matches.some(m=>m.id==='traditional'));
});
test('negated keywords do not become positive matches',()=>{
 assert.equal(predict("I don't want realistic, but thin lines.").matches[0].id,'fine-line');
 assert.ok(!predict('Not realistic').matches.some(m=>m.id==='realism'));
 assert.equal(engine.previewStyles('Δεν θέλω ρεαλιστικό, αλλά λεπτές γραμμές.','el',catalog).matches[0].id,'fine-line');
 assert.equal(predict('unrealistic').matches.length,0);
});
test('result validator rejects hallucinated IDs, duplicates and empty answers',()=>{
 const ids=catalog.map(s=>s.id);
 assert.equal(engine.validFinderResult({matches:[{id:'invented',reason:'x'}],question:null},ids),false);
 assert.equal(engine.validFinderResult({matches:[],question:null},ids),false);
 assert.equal(engine.validFinderResult({matches:[{id:'fine-line',reason:'x'},{id:'fine-line',reason:'y'}],question:null},ids),false);
 assert.equal(engine.validFinderResult(predict('thin lines'),ids),true);
});
function route(env={},fetcher=()=>{throw Error('Unexpected external call');}){return load('app/api/style-finder/route.ts',{process:{env},fetch:fetcher,require:id=>id==='@/lib/data/styles'?{styles:catalog}:engine});}
const enabled={NODE_ENV:'development',STYLE_FINDER_AI_ENABLED:'true',OPENAI_API_KEY:'test-only-not-real'};
const req=(data,origin)=>new Request('http://localhost:3210/api/style-finder',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(data)});
test('AI stays disabled without configuration and in production',async()=>{
 for(const env of [{},{...enabled,NODE_ENV:'production'}]){
  const r=route(env);assert.equal((await r.GET().json()).mode,'preview');assert.equal((await r.POST(req({}))).status,503);
 }
});
test('invalid input and foreign origins never call the provider',async()=>{
 const r=route(enabled);
 assert.equal((await r.POST(req({description:'short',locale:'en'}))).status,400);
 assert.equal((await r.POST(req({description:'a'.repeat(1502),locale:'en'}))).status,400);
 assert.equal((await r.POST(req({description:'thin lines',locale:'xx'}))).status,400);
 assert.equal((await r.POST(req({description:'thin lines',locale:'en'},'https://untrusted.example'))).status,403);
 assert.equal((await r.POST(req({description:'a'.repeat(13000),locale:'en'}))).status,413);
});
test('provider adapter validates results, disables storage and caps local requests',async()=>{
 let calls=0;
 const r=route(enabled,async(url,init)=>{calls++;const b=JSON.parse(init.body);assert.equal(b.store,false);assert.equal(b.text.format.strict,true);assert.equal(b.max_output_tokens,1000);return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({matches:[{id:'fine-line',reason:'Thin linework.'}],question:null})}]}]});});
 for(let i=0;i<20;i++) assert.equal((await r.POST(req({description:'thin lines',locale:'en'}))).status,200);
 assert.equal((await r.POST(req({description:'thin lines',locale:'en'}))).status,429);assert.equal(calls,20);
 const invalid=route(enabled,async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{"matches":[],"question":null}'}]}]}));
 assert.equal((await invalid.POST(req({description:'thin lines',locale:'en'}))).status,502);
 const failing=route(enabled,async()=>{throw Error('private diagnostic');});
 const failure=await failing.POST(req({description:'thin lines',locale:'en'}));assert.equal(failure.status,502);assert.ok(!(await failure.text()).includes('private diagnostic'));
});
test('website and app matching and request logic stay identical',()=>{
 for(const file of ['style-finder.ts','use-style-finder.ts']) assert.equal(read('lib/'+file),fs.readFileSync(new URL('../../needl-app/src/lib/'+file,import.meta.url),'utf8'));
});
