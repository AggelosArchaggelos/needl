import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('lib/artist-search.ts',root),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const {findArtists}=exports;
const artists=[{id:'a',name:'Anna',styleIds:['fine'],rating:4.8,reviewCount:8},{id:'b',name:'Bob',styleIds:['black'],rating:4.2,reviewCount:3},{id:'c',name:'Cara',styleIds:['fine','black']},{id:'p',name:'Piercer',discipline:'piercing',styleIds:['fine']}];
const studio={id:'s',slug:'s',cityId:'athens',name:'Studio',rating:5,reviewCount:100,coordinates:{latitude:38,longitude:24},artists};
const all={cityId:'all',styleIds:[]};
test('filters individual styles rather than borrowing studio/team styles',()=>{
 const results=findArtists([studio],{...all,styleIds:['fine','black']});
 assert.equal(results[0].artist.id,'c'); assert.equal(results.length,3);
 assert.deepEqual(Array.from(findArtists([studio],{...all,styleIds:['fine']}),x=>x.artist.id).sort(),['a','c']);
 assert.equal(findArtists([studio],{...all,cityId:'patras'}).length,0);
});
test('ratings and obsolete rating filters do not affect inclusion or order',()=>{
 assert.equal(findArtists([studio],all).length,4);
 assert.deepEqual(Array.from(findArtists([studio],{...all,minArtistRating:4.5}),x=>x.artist.id),['a','b','c','p']);
});
test('obsolete distance inputs do not filter or reorder artists',()=>{
 const unknown={...studio,id:'unknown',coordinates:undefined};
 const filters={...all,origin:{latitude:0,longitude:0},maxDistanceKm:5};
 assert.deepEqual(Array.from(findArtists([studio,unknown],filters),x=>x.artist.id),Array.from(findArtists([studio,unknown],all),x=>x.artist.id));
 assert.equal(findArtists([studio],filters).length,4);
});
test('web and app use identical search rules',()=>{
 assert.equal(fs.readFileSync(new URL('lib/artist-search.ts',root),'utf8'),fs.readFileSync(new URL('../needl-app/src/lib/artist-search.ts',root),'utf8'));
});
