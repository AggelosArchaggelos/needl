# Adding real studios to Needl

1. Copy `STUDIO-INTAKE.md` into a private folder and collect the studio's information and original photos.
2. Review unknown values, piercing-specific information, image permissions and optional website details together before mapping them into published content.
3. Update the existing JSON files under `content/`. Never put private owner contact details in those files: the content API is public.
4. Run `npm run content:report` to regenerate `onboarding/CONTENT-REPORT.md`. Errors must be fixed; warnings need review.
5. Preview both the website and app before approving publication. The app receives content from its configured API, so its hosted content will only update after the website is deployed and refreshed.

`npm run build` now runs the content check first and stops for structural errors. Warnings do not block the beta's existing sample data. Nothing is uploaded by the checker.

## What is checked

Required fields and English/Greek text, duplicate IDs and route slugs, city/style references, artist ownership, numeric ranges, Instagram format, URL syntax, article dates and pricing copy. IDs remain stable so saved favourites keep working. Tattoo style names stay in English in the product; catalogue translations may still be stored.

The report identifies exact locations such as `studios[0].artists[1].bio.el`. Indices start at zero.

## What still needs a person

URL checks do not make network requests or prove a link works. Image warnings do not prove permission, authenticity or that the image host is configured. The current website image configuration allows Picsum only; choose and configure a real image host when importing real studios. Local image paths must point to existing public assets.

No content is automatically corrected. The local dashboard and public website/piercer fields are now implemented; see LOCAL-DASHBOARD.md and TEAM-AND-WEBSITES.md. Secure online editing, publishing, and protected pricing remain separate future changes. This workflow adds no subscription or account system.

## Undo

This tooling is saved separately in Git. Reverting its commit removes the validator, intake documents and build hook without changing the listed studios or earlier visual improvements. Completed intake forms kept elsewhere remain yours.
