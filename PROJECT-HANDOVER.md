## Release preparation — 2026-09-14

The owner explicitly authorised pushing all approved changes to both GitHub main branches and deploying both existing Vercel betas, excluding private experimental studio material. This release checkout is a clean snapshot based on origin/main; private local preview history is intentionally not merged or pushed. Local-only content, source provenance, private media route and identifying notes/tests are excluded. Do not push other local branches or tags. Subsequent releases require approval.

Website and app must release in that order because the app consumes website content/API. Style finder publishes as labelled keyword preview; real AI remains disabled in production. Local dashboard/email test routes remain development-only.

# Needl — shared project handover

Updated: 2026-09-14. Shared working context for Claude Code and Codex; this is a decision record, not a complete conversation transcript. Verify the actual files and Git history before acting. A newer explicit user instruction takes precedence.

## Project and current permission

Needl is a contemporary, minimal, luxurious directory for tattoo studios, artists and piercers in Greece. The website and app are in separate private repositories: AggelosArchaggelos/needl and AggelosArchaggelos/needl-app. The existing website beta is https://needl-vert.vercel.app.

The user authorised completion of the already discussed local improvements with separate saves and easy undo. On 2026-09-11 the user explicitly approved pushing all current changes to GitHub and deploying both beta versions to Vercel. This approval covers this release; obtain approval for future releases. Both repositories were pushed and both Vercel beta deployments are live. Website: https://needl-vert.vercel.app. App browser beta: https://needl-app.vercel.app. The app Vercel project was created under team needl2 and points EXPO_PUBLIC_API_BASE_URL at the hosted website. This is a browser showcase, not an App Store or Play Store release. Ask before new, unapproved feature or visual changes. Do not send messages or enquiry emails without authorisation. Do not use Lovable.

## Design and product decisions

- English is primary; Greek is supported with the same fonts in both languages: Literata, Manrope and JetBrains Mono. Tattoo style names remain English in both locales.
- The visually split EN/EL control acts as one toggle: pressing either side switches language.
- Latest approved pivot: Home showcases studios; Browse lists individual artists, linking to their own profiles and their studio. Only city and tattoo style filters remain. User subsequently removed rating filtering entirely on 2026-09-14; do not restore it. Style compatibility uses the individual artist, not studio/team styles. No price filter.
- Keep navigation uncluttered; Saved uses an outline heart in the desktop header. Keep the established subtle tab bubble animation, centred icons/labels and reduced-motion support. Do not reintroduce exaggerated bounce or the rejected blur experiments.
- Keep pages separate. Preserve the existing logo and opening animation; the calligraphy/gothic logo exploration was deferred.
- Studios are onboarded manually initially. Include their optional website, artist Instagram links and piercers with piercing-specific work. Do not force tattoo styles or prices onto piercing work.
- Pricing remains for studios after enquiry, not public navigation. Latest model replaces Founding/Pro/Featured with indefinite free access and a future EUR10 per listed artist studio plan. Monthly frequency is an explicit implementation assumption communicated for review. User decides when free access ends; no expiry or automatic charge. No billing system exists.
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


## Local enquiry preview (2026-09-11)

Added development-only /local-dashboard/signup-preview to show the actual form success UI without submitting data or sending email. Its pricing link opens the existing local pricing preview. No studio is automatically listed. TypeScript check passed. This later preview change remains local; do not deploy without further approval.


## Authorised owner-only email tests (in progress)

User authorised fictional booking and studio enquiry emails to aggkritharas@gmail.com. Local /local-dashboard/email-tests reuses the booking form with a development-only, same-origin /api/local-booking-test endpoint and fixed owner recipient. Normal public booking remains a simulation. Test success states provider acceptance, not appointment confirmation. Existing listing endpoint will be tested with TEST-labelled details. Local Resend key is absent; no email has been sent. User is being guided through Resend setup. TypeScript passed; missing-key returns503 and off-origin returns404. Nothing deployed.


## Owner email test results (2026-09-11)

User saved Resend sending key privately in ignored needl/.env.local. Sent exactly one fictional studio enquiry through the real local listing form/API and one fictional artist booking through the isolated local booking form/API, both only to aggkritharas@gmail.com. Both success screens rendered. Resend dashboard reported Delivered for listing c260b2d1-ee7e-4005-98b3-47abcc83d88b and booking 33c31405-eb0f-4239-ab2d-f29f10f69b2c. Gmail inbox placement awaits user confirmation. Booking selected Dimitra Vasou at Aria Ink Collective. No real appointment or directory listing created. These tests validate local email delivery only: public booking still simulates success, app delivery untested, production Resend/signing settings unchanged, no deploy performed. Never commit the key.


## Optional booking description (2026-09-11)

User confirmed tattoo description must be optional; studio can clarify directly with the client. Both forms already allowed empty notes; labels now explicitly say optional in English/Greek. Local booking test endpoint also accepts omitted/null notes and supplies a clarification message in the email. Name/contact remain required. Both TypeScript checks passed. No additional email sent; change is local and not deployed. This decision also applies to the future production booking implementation.



## Artist-first local preview (2026-09-14)

User approved this pivot for local testing only; no push/deploy authorised. Both repos are on artist-first-preview. Tag restore-before-artist-browse-20260914 preserves the starting point; main is unchanged. Separate local feature commits permit reverting pricing or discovery independently. Preserve unrelated untracked needl-drafts-2026-09-11.json.

Browse now lists artists with studio links; Home and studio team profiles remain. Shared search rules match individual styles, rank by number of matching styles, then name. Piercing-only artists do not match tattoo styles. Rating never inherits the studio Google rating. Seed data has NO individual artist ratings or coordinates; neither affects filtering now. New optional artist rating/reviewCount and studio coordinates can be entered in the local dashboard and are validated. No fictitious ratings or coordinates added.

Distance filtering and location requests were subsequently removed at the user's request. The expo-location dependency and permission plugin are removed. Optional studio coordinates remain available as content data only.

Pricing is driven by shared site-config.json: free indefinitely until owner decision; future EUR10 per artist per month paid by studio (monthly assumption pending user review). No billing implemented. Web local preview /local-dashboard/pricing. App dev /pricing can use development-only /api/local-pricing-preview when API_BASE_URL is localhost. Production gating unchanged; API preview returns404 outside development.

Checks: both TypeScript checks passed; 14 search/content/workspace/token tests passed; Expo web export passed. Website production build blocked fetching existing Google Fonts; escalation and browser verification rejected by automatic approval review because its review model was at capacity. No visual or physical-device pass claimed. Review /browse on website3210 and app8300, both languages, then studio/profile navigation and pricing before release. App local dev server was launched with EXPO_PUBLIC_API_BASE_URL=http://localhost:3210 only in process environment; committed hosted API configuration unchanged.

Undo: after preserving any later edits, switching both repos back to main restores the pre-pivot code while artist-first-preview retains this experiment. Alternatively revert the relevant feature commit in each affected repo; respect dependencies. Content/draft data backups are separate from code rollback. No emails sent and no production data changed during this pivot.


## Remove rating filtering (2026-09-14)

User found Browse crowded and explicitly requested no ratings filter. Removed the control, filter state/type, URL interpretation, count and rating-based search ordering in both versions. Obsolete rating inputs do not filter artists. Existing rating display/data remains; city, style and distance are unchanged. Separate local commits, no push or deploy. Both TypeScript checks and artist search regression tests passed.


## Remove distance filtering (2026-09-14)

User deferred distance entirely. Both versions now offer only city and tattoo style. Removed distance controls, location requests, distance labels and sorting, in-memory origin and radius fields, and the Expo location dependency/permission plugin. Updated English/Greek empty states. Obsolete distance inputs are ignored. Both TypeScript checks and four artist search regression tests passed. Saved as separate local undoable commits; no push or deployment.


## Studio photo enlargement (2026-09-14)

User requested enlarged viewing of the studio preview photos. Both studio detail pages now use a StudioGallery with accessible thumbnail buttons opening the existing PortfolioViewer in studioPhotos mode. Preserves thumbnail layout and existing viewer navigation/swipe/close behavior; website supports keyboard navigation and Escape via the dialog. Studio mode uses a studio-photo description and hides the artwork Save button so studio photos are not stored as portfolio favourites. Artist portfolio behavior is unchanged. This is tap-to-enlarge, not a new pinch/pan zoom implementation. Both TypeScript checks passed. Browser reload/interaction verification was blocked by automatic approval review at model capacity. Separate local feature commits, no deployment or contact.

## Beginner tattoo style guide (2026-09-14)

User requested replacing How it works with education for people unfamiliar with tattoo categories. Both versions now show Tattoo styles / Στιλ τατουάζ at the existing /how-it-works route. Twelve expandable explanations cover visual clues, written examples and differences/overlap; English style names remain in both locales. Home process section replaced with a short style-guide introduction and link. Existing typography/palette and tab animation preserved.

Editable bilingual guide data lives in website content/styles.json and travels to the app via /api/config. Optional guide type preserves API compatibility. App handles loading and missing guide data; when publishing is authorised, website API must deploy before app. Guide buttons link to artist Browse with the chosen style; native Browse now reads the styles query parameter and preserves it during scroll. No new rating/distance filters, contacts, emails or deployment. Research and editing notes in website onboarding/STYLE-GUIDE.md.

Checks: both TypeScript checks and all21 website regression/content tests passed. Website guide rendering/expansion, Fine Line browse link (five matching artists), and Greek copy with English style names verified in browser. App visual check remains outstanding: server8300 was stopped, and automatic approval review rejected restarting it because its review model was at capacity. No phone test or production build claimed. Separate local feature commits in both repos allow reverting this guide without removing earlier work; preserve later edits and revert both feature commits together. User draft export untouched.

## Remove studio price indicators (2026-09-14)

User requested removing homepage studio pricing and the unhelpful one/two/three-euro classification. Removed the complete price badge (classification and From amount) from shared studio cards in website and app, including Home and saved studio cards. Also removed the euro-band classification from both studio detail pages; explicit average session amounts remain on detail pages. Legacy priceBand content/type remains for backward-compatible API/draft validation but is no longer rendered to visitors. No layout, subscription pricing or filtering changes. Both TypeScript checks passed and diffs reviewed; no new browser/phone visual check claimed. Saved in separate local commits for undo; no push/deploy, user draft untouched.

## Style-finder assistant preview (2026-09-14)

User approved a separate description-to-style page linked at the bottom of Tattoo styles. Added /style-finder in website/app with bilingual description box, example, up to3 suggestions, visual follow-up for ambiguous input, reset/error/loading states and links to existing artist style filters. No new nav item. Existing fonts, palette and tab animations preserved.

Current mode is explicitly labelled on-device keyword preview, NOT AI. English/Greek visual cues, conservative negation and multiple styles supported; unfamiliar wording can miss matches. No paid calls or provider keys added. Shared lib/style-finder.ts and lib/use-style-finder.ts mirrored in app src/lib; parity regression tested. Pending requests abort/ignore stale results on description/locale changes/unmount. Description remains transient state, not saved or sent to studios.

Optional OpenAI Responses connection implemented server-side at /api/style-finder, strict structured output plus runtime validation of known IDs, bounded input/output, timeout, generic errors and store:false. To activate LOCAL real AI owner supplies OPENAI_API_KEY and STYLE_FINDER_AI_ENABLED=true in website .env.local and restarts. Model configurable, default gpt-4.1-mini. UI discloses provider transmission before submission. Backend is hard-disabled in production and limited20 calls/hour/process in development; restart resets count. This is not durable public spending protection. Before public AI activation implement shared quotas/access controls and review budget/privacy. No real provider inference verified; tests mock it. Detailed setup/limits/undo in website onboarding/STYLE-FINDER.md; ignored .env.local.example also updated without secrets.

Verification: both TypeScript checks and all28 regression tests pass. Website screenshot and Greek sample -> Fine Line verified. English locale switch clears previous results; dragon-only description asks visual follow-up; Thin lines answer yields Fine Line. App preview at http://localhost:8301/style-finder verified example -> Fine Line using local API3210 (process env only). Original8300 initially unresponsive, later loaded; additional Expo session31941 on8301 started for testing. App Find artists navigation click blocked by automatic approval review at review-model capacity; no final navigation or physical phone pass claimed. No production build, push, deploy, emails or external model calls. User draft export untouched. Separate feature commits in each repository for easy coordinated revert.

## Style-finder keyboard and result scrolling (2026-09-14)

User requested Enter-to-submit and smooth positioning of results. Website textareas submit on plain Enter, preserve Shift+Enter newlines and ignore IME composition/repeated key events. Both initial and follow-up forms use existing submission validation. Successful results focus the result heading without jumping, then smoothly scroll it toward the upper-middle viewport (22vh scroll margin). Reduced motion uses instant positioning.

App TextInput uses submit editing with a Go key and blur/submit behavior; RN Web preserves Shift+Enter and IME via its existing TextInput handling. Both main and follow-up submit handlers respect disabled/loading state. Results dismiss keyboard, wait350ms for layout/keyboard settling, then ScrollView scrolls to18% below its top; extra bottom space allows short results to reach the target. Reduced motion disables animated scroll. Cleanup cancels pending scroll on result changes/unmount. No matching/API changes.

Both TypeScript checks passed. Website Enter -> Fine Line and upper-middle positioning verified by screenshot; Shift+Enter inserts newline without submitting. App browser preview8301 Enter -> Fine Line and settled result position verified by screenshot. Physical iOS/Android keyboard behavior not tested. Separate local commits; no push/deploy; existing user draft untouched.

## Gentler result scroll (2026-09-14)

User found platform-default smooth scrolling too abrupt. Replaced it in website/app style finder with a shared1200ms cosine ease-in/out requestAnimationFrame animation (lib/result-scroll.ts, mirrored in app). Same upper-middle destination; web clamps to document bounds. Reduced motion remains immediate. Cleanup cancels in-flight movement, website wheel/touch/key input interrupts, app touch/drag interrupts. Native retains350ms keyboard-settling delay. Both TypeScript checks passed; timing set explicitly in code, no physical-device visual verification in this adjustment. Separate local undo commits; no push/deploy.

## Fix Enter cancelling result scroll (2026-09-14)

User reported the slower animation disappearing. Website effect registered a global keydown cancellation listener during the same discrete Enter event that submitted the form; the bubbling submission event could cancel its scheduled animation. Restrict cancellation to navigation/scroll keys (arrows, PageUp/Down, Home/End, Space, Escape, Tab); Enter no longer cancels. Wheel/touch interruption retained. Website TypeScript passed. Browser Enter submission verified with intermediate and completed scroll screenshots, demonstrating progressive movement and final upper-middle result position. App had no global keydown listener and needed no code change. Separate local fix, no push/deploy.
