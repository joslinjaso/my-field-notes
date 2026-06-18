# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:5173/my-field-notes/
npm run build      # type-check + build to dist/
npm run deploy     # build + push to gh-pages branch (deploys to GitHub Pages)
npm run lint       # eslint
```

No test suite exists.

## Architecture

A single-page React PWA that lets a user take a photo, add a note and GPS location, then upload the photo to Google Drive and append a row to a Google Sheet — all from the browser using the signed-in user's own OAuth token (no backend).

**Auth flow:** `useGoogleAuth` (`src/hooks/useGoogleAuth.ts`) loads the Google Identity Services script and uses `google.accounts.oauth2.initTokenClient` to obtain a short-lived access token on demand. No tokens are persisted — the user must re-auth after ~1 hour.

**Data flow on submit (`App.tsx`):**
1. `uploadToDrive` — multipart POST to Drive API, then sets file permission to `anyone/reader`, returns a public `drive.google.com/uc?id=` URL
2. `appendToSheet` — POST to Sheets API appending `[timestamp, note, lat, lng, driveUrl]` to `Sheet1`

**Config (`src/lib/google.ts`):** reads three `VITE_*` env vars — `VITE_GOOGLE_CLIENT_ID`, `VITE_SHEET_ID`, `VITE_DRIVE_FOLDER_ID` (optional). These must be set in `.env` before building.

**Deployment:** `vite.config.ts` sets `base: '/my-field-notes/'` for GitHub Pages. The `npm run deploy` script builds and pushes `dist/` to the `gh-pages` branch via the `gh-pages` package.

**Camera:** uses `<input type="file" accept="image/*" capture="environment">` — triggers the native camera on mobile, file picker on desktop.
