# Local dashboard prototype

Open http://localhost:3210/local-dashboard while the website development server is running.

- Select a studio or news article to edit a browser-local draft, or choose **New draft**.
- Expand a team member to edit artist/piercer details and portfolio photo URLs.
- Changes are saved in this browser's local storage under `needl-local-editor-v1`. Typing does not update the content files or API.
- **Export drafts / Import drafts** moves the workspace, including trash, through a JSON file. Import asks before replacing current browser drafts; export first to keep both copies.
- **Back up to this computer** saves under `.local-data/drafts.json`; previous disk backups are retained. **Load disk backup** restores it to the browser after confirmation. These files are ignored by Git and do not travel with a push.
- **Apply to local preview** explicitly replaces the local studio/news content files with all non-trashed drafts, after full validation. This is not an upload. It creates a `content-backup-*` folder containing the previous files before writing. Failed writes trigger rollback. To undo a successful apply, ask the agent to restore both JSON files from the named backup or restore the desired Git checkpoint. Keep that backup until review is complete.
- The local apply endpoint only works in development on localhost with a matching request origin. It is disabled in production. The app must point its `EXPO_PUBLIC_API_BASE_URL` at the local API and refresh to see these local content changes; it currently uses the hosted API.
- **Preview** shows the current draft. **Mark for local review** is an in-session marker, not publication or permanent approval.
- Missing-field checks are intentionally lighter than the final content validator. Review image permissions, factual details, prices and final validation separately.
- Image input currently accepts hosted HTTPS URLs, not file uploads. Opening a preview loads those images from the specified hosts.
- Draft storage is not a backup. Clearing browser data removes drafts. Keep your completed intake forms and original photographs separately. If storage fails, keep the tab open and preserve the information elsewhere.
- Production renders the not-found page for this route. This is not an authenticated online admin area. Secure owner sign-in, durable shared storage and online publishing still require service configuration. Local filesystem backups will not persist on Vercel and must not be used as its database.

The initial workspace is copied from the project's sample content on first use. Existing browser drafts are deliberately not replaced when seed content changes. Public clients now support website links and piercing details, but editing a draft still does not publish it. See TEAM-AND-WEBSITES.md.
