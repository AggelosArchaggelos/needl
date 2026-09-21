import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateContent } from './validate-content.mjs';
const read = name => JSON.parse(fs.readFileSync(new URL('../content/' + name + '.json', import.meta.url), 'utf8'));
const loc = text => ({ en: text, el: text });
const testArtist = (n, studioSlug) => ({ id:'test-artist-'+n, slug:'test-artist-'+n, name:'Test Artist '+n, studioSlug, role:loc('Tattooist'), bio:loc('Test bio'), yearsExperience:5, avatarUrl:'https://picsum.photos/seed/test-avatar-'+n+'/300/300', instagramHandle:'test.artist'+n, styleIds:['fine-line'], discipline:'tattoo',
 portfolio:[{ id:'test-piece-'+n, imageUrl:'https://picsum.photos/seed/test-piece-'+n+'/640/800', styleId:'fine-line', caption:'Test piece', priceEUR:100 }] });
// Synthetic studio so the rules are tested independently of the live catalogue.
const testStudios = () => [{ id:'test-studio', slug:'test-studio', name:'Test Studio', cityId:'athens', neighborhood:loc('Test'), address:'1 Test St', description:loc('Test'), heroImageUrl:'https://picsum.photos/seed/test-hero/1600/1000', galleryImages:['https://picsum.photos/seed/test-gallery/900/700'], rating:4.5, reviewCount:10, priceBand:'€€', avgSessionEUR:100, styleIds:['fine-line'], instagramHandle:'test.studio', phone:'+30 210 0000000', hours:loc('Mon-Fri'), promoted:false, artists:[testArtist(1,'test-studio'), testArtist(2,'test-studio')] }];
const fixture = () => ({ studios:testStudios(), cities:read('cities'), styles:read('styles'), news:read('news'), config:read('site-config') });
test('current seed content has no structural errors but warns about placeholders', () => {
 const issues=validateContent(fixture()); assert.equal(issues.filter(i=>i.level==='ERROR').length,0); assert.ok(issues.some(i=>i.message.includes('Placeholder')));
});
test('missing translations, wrong references, duplicate IDs and unsafe URLs are reported together', () => {
 const data=fixture(); const s=data.studios[0];
 s.description.el=''; s.cityId='missing'; s.heroImageUrl='javascript:alert(1)';
 s.artists[0].studioSlug='wrong'; s.artists[1].id=s.artists[0].id;
 const errors=validateContent(data).filter(i=>i.level==='ERROR');
 for(const field of ['description.el','cityId','heroImageUrl','studioSlug','.id']) assert.ok(errors.some(i=>i.location.endsWith(field)),field);
});
test('malformed nested values produce a report instead of crashing', () => {
 const data=fixture(); data.studios=[null,{artists:[null]}]; data.news=[null]; data.config=null;
 assert.ok(validateContent(data).some(i=>i.level==='ERROR'));
});
test('invalid numbers and impossible calendar dates are rejected', () => {
 const data=fixture(); data.studios[0].rating=6; data.studios[0].reviewCount=1.5; data.news[0].publishedAt='2026-02-30';
 const errors=validateContent(data).filter(i=>i.level==='ERROR');
 for(const field of ['rating','reviewCount','publishedAt']) assert.ok(errors.some(i=>i.location.endsWith(field)));
});
test('optional websites are not required, but unsafe supplied URLs are rejected', () => {
 const data=fixture(); data.studios[0].websiteUrl='https://example.com';
 assert.ok(!validateContent(data).some(i=>i.location.endsWith('websiteUrl')));
 data.studios[0].websiteUrl='https://user:password@example.com';
 assert.ok(validateContent(data).some(i=>i.location.endsWith('websiteUrl') && i.level==='ERROR'));
});
test('piercer portfolios accept no tattoo style and no indicative price', () => {
 const data=fixture(); const a=data.studios[0].artists[0];
 a.discipline='piercing'; a.piercingSpecialities='Ear curation'; a.styleIds=[];
 a.portfolio=[{id:'piercing-test',kind:'piercing',imageUrl:'https://picsum.photos/seed/piercing/400/400',caption:'Curated ear'}];
 assert.equal(validateContent(data).filter(i=>i.level==='ERROR').length,0);
 a.portfolio[0].styleId='fine-line';
 assert.ok(validateContent(data).some(i=>i.level==='ERROR' && i.location.endsWith('.styleId')));
});
test('mixed team members retain per-work categories and tattoo style validation', () => {
 const data=fixture(); const a=data.studios[0].artists[0]; a.discipline='both';
 a.portfolio.push({id:'mixed-piercing-test',kind:'piercing',imageUrl:'https://picsum.photos/seed/mixed/400/400',caption:'Helix'});
 assert.equal(validateContent(data).filter(i=>i.level==='ERROR').length,0);
 a.portfolio[0].styleId='not-a-style';
 assert.ok(validateContent(data).some(i=>i.level==='ERROR' && i.location.endsWith('.styleId')));
 delete a.portfolio[0].styleId;
 const unclassified=validateContent(data).filter(i=>i.location.endsWith('.styleId'));
 assert.ok(unclassified.length && unclassified.every(i=>i.level==='WARNING'));
 a.discipline='invalid';
 assert.ok(validateContent(data).some(i=>i.location.endsWith('.discipline')));
});

test('optional artist ratings and studio coordinates must be valid when supplied', () => {
 const data=fixture(); const studio=data.studios[0]; const artist=studio.artists[0];
 studio.coordinates={latitude:37.98,longitude:23.72}; artist.rating=4.7; artist.reviewCount=12;
 assert.equal(validateContent(data).filter(i=>i.level==='ERROR').length,0);
 studio.coordinates.latitude=91; artist.rating=5.5; artist.reviewCount=0;
 const errors=validateContent(data).filter(i=>i.level==='ERROR');
 for(const field of ['latitude','rating','reviewCount']) assert.ok(errors.some(i=>i.location.endsWith(field)),field);
});

test('the live catalogue passes validation with no errors', () => {
 const live={ studios:read('studios'), cities:read('cities'), styles:read('styles'), news:read('news'), config:read('site-config') };
 assert.equal(validateContent(live).filter(i=>i.level==='ERROR').length,0);
});
