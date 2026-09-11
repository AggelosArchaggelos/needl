# Local dashboard prototype

Open http://localhost:3210/local-dashboard while the website development server is running.

- Select a studio or news article to edit a browser-local draft, or choose **New draft**.
- Expand a team member to edit artist/piercer details and portfolio photo URLs.
- Changes are saved in this browser's local storage under `needl-local-editor-v1`. They do not update the JSON content files, API or app.
- **Preview** shows the current draft. **Mark for local review** is an in-session marker, not publication or permanent approval.
- Missing-field checks are intentionally lighter than the final content validator. Review image permissions, factual details, prices and final validation separately.
- Image input currently accepts hosted HTTPS URLs, not file uploads. Opening a preview loads those images from the specified hosts.
- Draft storage is not a backup. Clearing browser data removes drafts. Keep your completed intake forms and original photographs separately. If storage fails, keep the tab open and preserve the information elsewhere.
- Production renders the not-found page for this route. This is not an authenticated online admin area. Secure sign-in, permanent storage, publishing and pricing access rules are separate work.

The initial workspace is copied from the project's sample content on first use. Existing browser drafts are deliberately not replaced when seed content changes. Editing website links and piercing details here does not implement their public display.
