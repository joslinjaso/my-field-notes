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

A single-page React PWA that lets a user take a photo, add a note, then upload the photo to Google Drive and append a row to a Google Sheet — all from the browser using the signed-in user's own OAuth token (no backend).

**Auth flow:** `useGoogleAuth` (`src/hooks/useGoogleAuth.ts`) loads the Google Identity Services script and uses `google.accounts.oauth2.initTokenClient` to obtain a short-lived access token. After sign-in, the email is verified against an allowlist (`jason.joslin1@gmail.com`) via the userinfo endpoint. The token is persisted in `localStorage` (key: `field-notes-token`) and restored on page load — sessions last up to ~1 hour without re-authentication. Token is cleared on expiry or unauthorized access.

**Data flow on submit (`App.tsx`):**
1. `uploadToDrive` (`src/hooks/useDriveUpload.ts`) — multipart POST to Drive API, sets file permission to `anyone/reader`, returns a `drive.google.com/uc?id=` URL
2. `appendToSheet` (`src/hooks/useSheetsAppend.ts`) — POST to Sheets API appending `[item, area, description, driveUrl]` to columns A–D (data starts at row 9, rows 1–8 are metadata/headers)

**Sheet schema:** rows 1–7 = project metadata, row 8 = headers (Item | Area | Description | Image), row 9+ = data rows.

**List view (`src/pages/ListView.tsx`):** reads rows 9+ from the sheet via `getSheetRows` (`src/hooks/useSheetsRead.ts`) and displays cards with thumbnail images. Drive URLs are converted to `drive.google.com/thumbnail?id=&sz=w800` for embedding.

**Navigation:** hash-based routing (`#/` = capture form, `#/list` = list view) with a fixed bottom tab bar. No router library.

**Config (`src/lib/google.ts`):** reads three `VITE_*` env vars — `VITE_GOOGLE_CLIENT_ID`, `VITE_SHEET_ID`, `VITE_DRIVE_FOLDER_ID` (optional). These must be set in `.env` before building.

**Deployment:** `vite.config.ts` sets `base: '/my-field-notes/'` for GitHub Pages. The `npm run deploy` script builds and pushes `dist/` to the `gh-pages` branch via the `gh-pages` package.

**Camera:** uses `<input type="file" accept="image/*" capture="environment">` — triggers the native camera on mobile, file picker on desktop.
