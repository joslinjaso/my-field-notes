export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
export const SHEET_ID = import.meta.env.VITE_SHEET_ID as string
export const DRIVE_FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID as string | undefined

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ')
