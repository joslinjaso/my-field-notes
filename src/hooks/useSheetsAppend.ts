import { SHEET_ID } from '../lib/google'

export async function appendToSheet(
  accessToken: string,
  row: [string, string, string, string],
): Promise<void> {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/A1:D:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  })
  if (!res.ok) throw new Error(`Sheets append failed: ${res.status}`)
}
