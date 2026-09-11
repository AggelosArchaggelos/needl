# Studio websites and piercers

The shared public content now supports:

- `studio.websiteUrl`: optional full HTTP(S) URL without credentials. Omit it when there is no website. Invalid links are hidden by both clients and flagged by content checks.
- `artist.discipline`: `tattoo`, `piercing`, or `both`. Omitted values retain the legacy tattoo-artist behaviour.
- `artist.piercingSpecialities`: optional plain text such as “Ear curation and jewellery fitting”. Use established piercing terms or bilingual text where needed. The title is translated in the clients.
- `portfolio.kind`: `tattoo` or `piercing`; omission retains tattoo behaviour.
- Tattoo works require a configured `styleId`. Piercing works omit that field.
- `portfolio.priceEUR` is optional. Omit unconfirmed prices; a zero still means an explicitly supplied zero, not “unknown”.

Both clients show the team discipline, existing role, specialities, and piercing portfolio labels. The dashboard supports work type and tattoo-style selection and optional prices. Drafts still stay in browser storage and require review and manual content publication. There are no new public filter options or changes to booking delivery.

Existing local piercing drafts may still contain tattoo-style values from the earlier prototype. Select their work type explicitly and review them before moving data into the public content files. Studio-wide prices and ratings remain required by the existing model; do not invent these when unknown.

The app must receive this client update before publishing piercing portfolios that omit `styleId`; older app builds assume every piece has a tattoo style. Website and app updates should therefore be coordinated before real piercing content is published.
