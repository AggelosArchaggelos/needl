# Needl — shared project handover

Updated: 2026-09-11. Shared working context for Claude Code and Codex; this is a decision record, not a complete conversation transcript. Verify the actual files and Git history before acting. A newer explicit user instruction takes precedence.

## Project and current permission

Needl is a contemporary, minimal, luxurious directory for tattoo studios, artists and piercers in Greece. The website and app are in separate private repositories: AggelosArchaggelos/needl and AggelosArchaggelos/needl-app. The existing website beta is https://needl-vert.vercel.app.

The user authorised completion of the already discussed local improvements with separate saves and easy undo. On 2026-09-11 the user explicitly approved pushing all current changes to GitHub and deploying both beta versions to Vercel. This approval covers this release; obtain approval for future releases. Both repositories were pushed and both Vercel beta deployments are live. Website: https://needl-vert.vercel.app. App browser beta: https://needl-app.vercel.app. The app Vercel project was created under team needl2 and points EXPO_PUBLIC_API_BASE_URL at the hosted website. This is a browser showcase, not an App Store or Play Store release. Ask before new, unapproved feature or visual changes. Do not send messages or enquiry emails without authorisation. Do not use Lovable.

## Design and product decisions

- English is primary; Greek is supported with the same fonts in both languages: Literata, Manrope and JetBrains Mono. Tattoo style names remain English in both locales.
- The visually split EN/EL control acts as one toggle: pressing either side switches language.
- Browse filters are city and tattoo style only. Do not restore minimum rating, pricing or rating sorting. Featured placement precedes alphabetical ordering.
- Keep navigation uncluttered; Saved uses an outline heart in the desktop header. Keep the established subtle tab bubble animation, centred icons/labels and reduced-motion support. Do not reintroduce exaggerated bounce or the rejected blur experiments.
- Keep pages separate. Preserve the existing logo and opening animation; the calligraphy/gothic logo exploration was deferred.
- Studios are onboarded manually initially. Include their optional website, artist Instagram links and piercers with piercing-specific work. Do not force tattoo styles or prices onto piercing work.
- Pricing is for studios after enquiry, not public navigation. Founding is the free first month; Pro approximately EUR45–50/month; Featured approximately EUR70–75/month. Paid amounts remain provisional. No billing system exists.
- News exists; future Inked Magazine automation is deferred. Real studio content will replace illustrative seed data as the owner obtains it.

## Architecture

Website: Next.js 16.3.2 App Router, React, Tailwind4, Base UI (not Radix), motion/react. Follow local bundled Next documentation. App: Expo57, Expo Router, React Native StyleSheet. Read version-matched docs before changes.

Website content/*.json is the shared content source. Website imports it and exposes API routes for the app. UI translations live in code; bilingual content fields use {en,el}. The app fetches at runtime and caches directory data separately from news. Its currently configured API is the hosted beta: applying local content does not change that hosted app data. Point a local app preview at the local API to review shared content before deployment.

Local previews: website http://localhost:3210; app web preview http://localhost:8300. They require their development servers running. Check availability rather than assuming a server persists.

## Completed local improvements

Portfolio viewer, locally saved favourites, subtle/reduced motion, readability improvements, content templates and validator, app directory caching with independent news loading, studio websites and piercing profiles, browse filter/scroll continuity, enquiry-gated pricing, and local dashboard draft management.

Dashboard: /local-dashboard, development only. Browser drafts support Trash/Restore and confirmed permanent deletion. Export/import transfers drafts; disk backup/load uses ignored .local-data files. Apply to local preview validates content, excludes trash, backs up original content and writes local studios/news JSON. It does not publish online. Photos are URL references; retain original files separately. Never overwrite user drafts during tests.

Pricing: successful delivered enquiry grants one hour of access, via HttpOnly cookie on web and in-memory token on app. This is NOT verified studio ownership or subscription authentication. /api/config omits pricing; /pricing redirects unauthorised visitors to /for-studios. Owner development preview: /local-dashboard/pricing.

Get listed uses Resend to aggkritharas@gmail.com. Real delivery still needs deployment configuration. Production also requires STUDIO_ACCESS_SECRET (strong random value, at least 32 characters). Never store keys in this handover or Git. Booking currently simulates success; real booking delivery was deferred, and must not be represented as working.

## Verification and unfinished work

Production build, both TypeScript checks and nine content/workspace/token tests passed. Production checks confirmed local dashboard routes return404, protected pricing returns401 without access, and public config omits prices. No real enquiry email was sent and no real content was applied during tests. Seed content still produces placeholder-image warnings.

Pending: further user feedback; real content; physical iOS/Android testing (the owner's Expo Go previously did not support SDK57); real email verification; eventual booking delivery, billing and store releases. Online owner administration still needs secure identity, owner-only server permissions, durable shared content/image storage and tested publication/rollback. Local backups are not cloud storage. Coordinate new app and website API releases because the pricing API contract changed.

## Undo and checkpoints

Each completed feature has local commits. Revert the relevant commit in the relevant repo to undo code; do not hard reset, clean or overwrite unrelated work. Code undo does not restore permanently deleted draft data. Export/back up content separately before replacement. .local-data is intentionally not committed and must be copied separately for migration when needed.

Recent website checkpoints: 21f443e browse continuity; 34ebd77 protected pricing; 59f7fe1 enquiry validation; 1ad7d06 portable drafts/local apply. App: fdf2218 browse continuity; 1b6406b protected pricing. Earlier baseline tag: restore-before-portfolio-20260911. Consult Git history for earlier feature commits. New documentation commits naturally follow this list.

Further workflow details: website onboarding/LOCAL-DASHBOARD.md and onboarding/LOCAL-REVIEW.md.

## Keeping both assistants informed

Read this file at task start. After meaningful approved work, update completed work, decisions, checks, limitations and next steps. Keep a matching copy at PROJECT-HANDOVER.md in both repositories when both are available; if only one is available, record that its sibling needs synchronisation. Preserve existing decisions; distinguish proposed work from approved work. Never invent missing discussion. These files share context when both assistants read them; they do not automatically synchronise chat history or transfer files to another computer. The approved current release has been pushed; future releases still require approval.


## Beta deployment verification (2026-09-11)

Vercel marked website commit 6dd8220 and app commit 00bb5f3 Ready. Public website API returns content without pricing; local dashboard/write endpoints return404 and protected pricing returns401. App home loads the live directory; direct profile routes return the app shell. App hosting uses Expo single web output with Vercel rewrites so runtime studio/artist routes open directly. Both repositories retain separate feature commits for undo. Website deployment currently has only STUDIO_SIGNUP_NOTIFY_EMAIL configured: Resend and signing-secret setup remains pending; no enquiry email was sent. Documentation-only sync commits follow the verified code commits.

