import { SHEET_ID } from '../lib/google'

export async function getSheetRows(accessToken: string): Promise<string[][]> {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}` +
    `/values/A9:D`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Sheets read failed: ${res.status}`)
  const data = await res.json()
  return data.values ?? []
}
