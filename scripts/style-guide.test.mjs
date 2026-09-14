import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateContent } from './validate-content.mjs';
const read=name=>JSON.parse(fs.readFileSync(new URL('../content/'+name+'.json',import.meta.url),'utf8'));
test('every configured style has a complete bilingual guide',()=>{
 for(const style of read('styles')) for(const field of ['summary','description','example','comparison']) for(const lang of ['en','el']) assert.ok(style.guide?.[field]?.[lang]?.trim(),style.id+'.'+field+'.'+lang);
});
test('missing guide translation is caught before publication',()=>{
 const data={studios:read('studios'),cities:read('cities'),styles:read('styles'),news:read('news'),config:read('site-config')};
 data.styles[0].guide.example.el='';
 assert.ok(validateContent(data).some(i=>i.level==='ERROR'&&i.location==='styles[0].guide.example.el'));
});
