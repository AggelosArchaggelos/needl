import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function validateContent({ studios, cities, styles, news, config }) {
  const issues = [];
  const add = (level, location, message) => issues.push({ level, location, message });
  const error = (p, m) => add('ERROR', p, m);
  const warn = (p, m) => add('WARNING', p, m);
  const object = (v, p) => { if (!v || typeof v !== 'object' || Array.isArray(v)) { error(p, 'Expected an object.'); return false; } return true; };
  const text = (v, p) => { if (typeof v !== 'string' || !v.trim()) { error(p, 'Required text is missing.'); return false; } return true; };
  const list = (v, p, required = false) => { if (!Array.isArray(v)) { error(p, 'Expected a list.'); return []; } if (required && !v.length) error(p, 'Add at least one entry.'); return v; };
  const localized = (v, p) => { if (object(v, p)) for (const lang of ['en', 'el']) text(v[lang], p + '.' + lang); };
  const number = (v, p, max = Infinity, integer = false) => { if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > max || (integer && !Number.isInteger(v))) error(p, 'Expected a non-negative ' + (integer ? 'whole ' : '') + 'number' + (max < Infinity ? ' up to ' + max : '') + '.'); };
  const unique = (v, p, seen) => { if (text(v, p)) { if (seen.has(v)) error(p, 'Duplicate value: ' + v); seen.add(v); } };
  const slug = (v, p) => { if (text(v, p) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) error(p, 'Use lowercase words separated by hyphens.'); };
  const url = (v, p, image = false) => {
    if (!text(v, p)) return;
    if (image && v.startsWith('/') && !v.startsWith('//') && !v.includes('..')) return;
    try { const u = new URL(v); if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password) throw Error();
      if (u.protocol !== 'https:') warn(p, 'Use HTTPS where available.');
      if (image && u.hostname === 'picsum.photos') warn(p, 'Placeholder image: replace before publishing a real studio.');
      else if (image) warn(p, 'Confirm this image host is allowed in next.config.ts before publishing.');
    } catch { error(p, 'Use a valid HTTP(S) URL without embedded credentials.'); }
  };
  const instagram = (v, p) => { if (text(v, p) && !/^[A-Za-z0-9._]{1,30}$/.test(v)) error(p, 'Use the Instagram handle only, without @ or a URL.'); };
  const catalog = (data, p, city = false) => { const seen = new Set(); for (const [i, item] of list(data, p, true).entries()) { const at = p + '[' + i + ']'; if (!object(item, at)) continue; unique(item.id, at + '.id', seen); localized(item.name, at + '.name'); if (city) localized(item.region, at + '.region'); } return seen; };
  const cityIds = catalog(cities, 'cities', true), styleIds = catalog(styles, 'styles');
  const refs = (v, p) => { const seen = new Set(); for (const id of list(v, p)) { unique(id, p, seen); if (!styleIds.has(id)) error(p, 'Unknown tattoo style: ' + id); } };
  const studioIds = new Set(), studioSlugs = new Set(), artistIds = new Set(), pieceIds = new Set(), names = new Set();
  for (const [i, s] of list(studios, 'studios', true).entries()) {
    const p = 'studios[' + i + ']'; if (!object(s, p)) continue;
    unique(s.id, p + '.id', studioIds); unique(s.slug, p + '.slug', studioSlugs); slug(s.slug, p + '.slug'); text(s.name, p + '.name');
    if (typeof s.name === 'string') { const key = s.name.trim().toLowerCase(); if (names.has(key)) warn(p + '.name', 'Possible duplicate studio name.'); names.add(key); }
    if (!cityIds.has(s.cityId)) error(p + '.cityId', 'Choose a configured city.');
    for (const field of ['neighborhood', 'description', 'hours']) localized(s[field], p + '.' + field);
    text(s.address, p + '.address');
    if (text(s.phone, p + '.phone') && !/^\+?[\d\s().-]{7,24}$/.test(s.phone)) error(p + '.phone', 'Check the phone number format.');
    instagram(s.instagramHandle, p + '.instagramHandle');
    if (s.websiteUrl !== undefined && s.websiteUrl !== '') url(s.websiteUrl, p + '.websiteUrl');
    url(s.heroImageUrl, p + '.heroImageUrl', true);
    list(s.galleryImages, p + '.galleryImages', true).forEach((v, n) => url(v, p + '.galleryImages[' + n + ']', true));
    number(s.rating, p + '.rating', 5); number(s.reviewCount, p + '.reviewCount', Infinity, true); number(s.avgSessionEUR, p + '.avgSessionEUR');
    if (!['€', '€€', '€€€'].includes(s.priceBand)) error(p + '.priceBand', 'Choose €, €€ or €€€.');
    if (typeof s.promoted !== 'boolean') error(p + '.promoted', 'Expected true or false.');
    refs(s.styleIds, p + '.styleIds');
    const artistSlugs = new Set();
    for (const [j, a] of list(s.artists, p + '.artists', true).entries()) {
      const q = p + '.artists[' + j + ']'; if (!object(a, q)) continue;
      unique(a.id, q + '.id', artistIds); unique(a.slug, q + '.slug', artistSlugs); slug(a.slug, q + '.slug'); text(a.name, q + '.name');
      if (a.studioSlug !== s.slug) error(q + '.studioSlug', 'Must match the parent studio slug.');
      if (a.discipline !== undefined && !['tattoo', 'piercing', 'both'].includes(a.discipline)) error(q + '.discipline', 'Choose tattoo, piercing or both.');
      if (a.piercingSpecialities !== undefined && typeof a.piercingSpecialities !== 'string') error(q + '.piercingSpecialities', 'Expected text.');
      localized(a.role, q + '.role'); localized(a.bio, q + '.bio'); number(a.yearsExperience, q + '.yearsExperience', Infinity, true);
      instagram(a.instagramHandle, q + '.instagramHandle'); url(a.avatarUrl, q + '.avatarUrl', true); refs(a.styleIds, q + '.styleIds');
      for (const [k, piece] of list(a.portfolio, q + '.portfolio', true).entries()) {
        const r = q + '.portfolio[' + k + ']'; if (!object(piece, r)) continue;
        unique(piece.id, r + '.id', pieceIds); text(piece.caption, r + '.caption'); url(piece.imageUrl, r + '.imageUrl', true); if (piece.priceEUR !== undefined) number(piece.priceEUR, r + '.priceEUR');
        if (piece.kind !== undefined && !['tattoo', 'piercing'].includes(piece.kind)) error(r + '.kind', 'Choose tattoo or piercing.');
        if (piece.kind !== 'piercing' && !styleIds.has(piece.styleId)) error(r + '.styleId', 'Tattoo work needs a configured tattoo style.');
        if (piece.kind === 'piercing' && piece.styleId) error(r + '.styleId', 'Piercing work should not have a tattoo style.');
      }
    }
  }
  const newsIds = new Set(), newsSlugs = new Set();
  for (const [i, n] of list(news, 'news').entries()) {
    const p = 'news[' + i + ']'; if (!object(n, p)) continue;
    unique(n.id, p + '.id', newsIds); unique(n.slug, p + '.slug', newsSlugs); slug(n.slug, p + '.slug');
    localized(n.title, p + '.title'); localized(n.excerpt, p + '.excerpt'); url(n.imageUrl, p + '.imageUrl', true); text(n.sourceName, p + '.sourceName');
    if (n.sourceUrl !== undefined) url(n.sourceUrl, p + '.sourceUrl');
    if (typeof n.publishedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(n.publishedAt) || !Number.isFinite(Date.parse(n.publishedAt)) || new Date(n.publishedAt).toISOString().slice(0,10) !== n.publishedAt) error(p + '.publishedAt', 'Use a valid YYYY-MM-DD date.');
    list(n.tags, p + '.tags').forEach((tag, j) => text(tag, p + '.tags[' + j + ']'));
  }
  if (object(config, 'site-config')) {
    text(config.siteName, 'site-config.siteName'); localized(config.tagline, 'site-config.tagline');
    if (typeof config.contactEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) error('site-config.contactEmail', 'Enter a valid email address.');
    list(config.pricingTiers, 'site-config.pricingTiers', true).forEach((tier, i) => {
      const p = 'site-config.pricingTiers[' + i + ']'; if (!object(tier, p)) return;
      for (const field of ['name', 'price', 'period', 'description']) localized(tier[field], p + '.' + field);
      list(tier.features, p + '.features', true).forEach((f, j) => localized(f, p + '.features[' + j + ']'));
      if (typeof tier.highlight !== 'boolean') error(p + '.highlight', 'Expected true or false.');
    });
  }
  return issues;
}

export function formatReport(issues) {
  const errors = issues.filter(i => i.level === 'ERROR').length;
  return '# Needl content check\n\n' + errors + ' error(s), ' + (issues.length - errors) + ' warning(s).\n\n' + (issues.length ? issues.map(i => '- **' + i.level + '** ' + i.location + ': ' + i.message).join('\n') : 'All checked fields passed.') + '\n\nThis is a structural check, not proof of link availability, image rights, factual accuracy or publication readiness.\n';
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const data = {}, issues = [];
  for (const [key, filename] of Object.entries({studios:'studios', cities:'cities', styles:'styles', news:'news', config:'site-config'})) {
    try { data[key] = JSON.parse(fs.readFileSync(path.join(root, 'content', filename + '.json'), 'utf8')); }
    catch { issues.push({ level:'ERROR', location:filename + '.json', message:'File is missing or contains invalid JSON.' }); }
  }
  if (!issues.length) issues.push(...validateContent(data));
  const report = formatReport(issues);
  console.log(report);
  if (process.argv.includes('--report')) fs.writeFileSync(path.join(root, 'onboarding', 'CONTENT-REPORT.md'), report);
  process.exitCode = issues.some(i => i.level === 'ERROR') ? 1 : 0;
}
