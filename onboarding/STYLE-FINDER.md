# Style finder

Entry: bottom of /how-it-works. Separate /style-finder page in website and app.

## Current preview
Default mode is an explicitly labelled keyword preview, running on the device. It supports English/Greek clues, conservative negation, multiple styles and a visual follow-up for unrecognised descriptions. It is NOT an AI model and cannot reliably understand arbitrary language. Subject-only descriptions deliberately do not imply a style. Results are suggestions, not certainty, and link to individual artist filtering. No description is saved in localStorage, sent to studios, or logged by this feature.

Both clients share identical lib/style-finder.ts and lib/use-style-finder.ts (app copies under src/lib). Catalog remains content/styles.json on website and /api/config on app. Rules only return IDs still in that catalog. App needs available catalog data. UI edits/language changes clear previous suggestions; pending results are cancelled/ignored when stale.

## Optional real AI connection
OpenAI Responses API server route /api/style-finder is implemented. It uses strict JSON output, validates returned IDs/reasons, limits inputs/output, disables response storage (store:false), handles incomplete/refused/failed responses and timeouts. Provider retention policies still apply; store:false is not a promise of zero retention. No tools, email or other outbound actions are provided to the model.

To test with real AI, owner configures needl/.env.local: OPENAI_API_KEY and STYLE_FINDER_AI_ENABLED=true, then restarts the website server. STYLE_FINDER_MODEL defaults to gpt-4.1-mini; configurable. Do not place secrets in app or browser public env vars. GET exposes mode only. The UI informs the visitor before submitting descriptions to OpenAI. No real provider key was added and no paid inference was performed in this change. Adapter tests use mocked responses, never an external provider.

Local AI is capped at20 requests per hour per server process, reset on process restart. Allowed browser origins include local ports3210 and8300; optional STYLE_FINDER_ALLOWED_ORIGINS adds exact LAN origins. Native requests have no browser Origin. This is a DEVELOPMENT guard, NOT a public spending guarantee. AI is hard-disabled in production, even with the key/flag set. Before public AI release implement durable shared quotas and appropriate access/abuse protection, choose a spending budget and review provider privacy disclosure. No silent keyword fallback on provider failure: a retry error is shown.

Reference: https://developers.openai.com/api/docs/guides/structured-outputs and https://developers.openai.com/api/docs/models/gpt-4.1-mini (checked2026-09-14).

## Undo
Revert this feature commit in both repositories together, preserving any later work. No content migration or personal data is involved. Do not deploy without owner review.
