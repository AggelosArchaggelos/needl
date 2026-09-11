# Local review before GitHub or Vercel

Nothing in this work pushes a branch or deploys a service. Code checkpoints are separate commits in the website and app repositories. Revert the relevant commit(s) to undo a feature; preserve local data separately before any data changes.

## Review now

- Website browse: select city/styles, open a profile and return. The URL carries filters; scroll position is retained per filter URL in this browser session. Invalid URL filters are ignored.
- App browse: filters and list position stay in memory across profile visits and tab remounts. They are not a cross-device preference.
- Dashboard: export/import drafts, back up/load from local disk, and explicitly apply validated content to the local preview. Applying excludes trashed items. Generated disk snapshots are private and ignored by Git.
- Pricing preview for the owner: `http://localhost:3210/local-dashboard/pricing` (development only).
- Anonymous `/pricing` redirects to studio onboarding. `/api/studio-pricing` requires a signed, expiring enquiry token. The public `/api/config` no longer includes plan prices. Price copy was removed from public translation dictionaries.

## Before enabling online studio enquiries

Set a strong random `STUDIO_ACCESS_SECRET` of at least 32 characters, along with the existing Resend settings, in the deployment environment. Never commit the secret. The server fails closed when the signing secret is missing in production.

A successfully delivered studio enquiry grants one hour of pricing access: an HttpOnly same-site cookie on the website, and an in-memory bearer token in the app. App access ends on restart or token expiry. This is an enquiry-based gate, not verified studio ownership, a user account, or a subscription system. No payments or booking delivery were added.

The new app version must be coordinated with the website API deployment. Old app builds relying on public pricing will no longer receive it. Old public pricing copies cannot be revoked from devices that already downloaded them.

## Service-dependent work still required for online administration

- Configure an identity provider and explicitly allow only the owner's account on server-side admin routes.
- Configure durable shared storage for draft/published content and image uploads, with owner-only write permissions, backups and version history.
- Import a reviewed dashboard export and its photos into that storage.
- Connect a publish action to the website/API and test ownership checks, draft privacy and rollback before exposing `/admin` online.

The local editor and write API remain disabled in production until that work is implemented. There is no online administrator login yet; adding a public link would not provide security.

## Validation performed

Production build and both TypeScript checks; content validation tests; isolated temporary-directory tests for backups, applying valid content and rejecting invalid content; production/off-origin write rejection; pricing token expiry/tampering and missing-secret checks. Production HTTP checks confirmed local admin endpoints return 404, pricing API returns 401 without access, and public config omits prices. No test enquiry email was sent and no real content was applied.

Physical iPhone/Android interaction testing and real email delivery remain to be checked before release.
