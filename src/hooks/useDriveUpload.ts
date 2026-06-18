import { DRIVE_FOLDER_ID } from '../lib/google'

export async function uploadToDrive(
  file: File,
  accessToken: string,
): Promise<string> {
  const metadata: Record<string, unknown> = {
    name: `field-note-${new Date().toISOString()}.jpg`,
    mimeType: file.type || 'image/jpeg',
  }
  if (DRIVE_FOLDER_ID) metadata.parents = [DRIVE_FOLDER_ID]

  const body = new FormData()
  body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  body.append('file', file)

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    },
  )
  if (!uploadRes.ok) throw new Error(`Drive upload failed: ${uploadRes.status}`)
  const { id: fileId } = await uploadRes.json()

  const permRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    },
  )
  if (!permRes.ok) throw new Error(`Drive permission failed: ${permRes.status}`)

  return `https://drive.google.com/uc?id=${fileId}`
}
