import { useState } from 'react'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import { uploadToDrive } from './hooks/useDriveUpload'
import { appendToSheet } from './hooks/useSheetsAppend'
import { PhotoCapture } from './components/PhotoCapture'
import { NoteForm } from './components/NoteForm'
import { StatusBanner } from './components/StatusBanner'

type Status = 'idle' | 'uploading' | 'success' | 'error'

export default function App() {
  const { token, signIn, isSignedIn } = useGoogleAuth()

  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [item, setItem] = useState('')
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [driveUrl, setDriveUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCapture = (file: File, previewUrl: string) => {
    setPhoto(file)
    setPreview(previewUrl)
    setStatus('idle')
    setDriveUrl(null)
  }

  const handleSubmit = async () => {
    if (!photo || !token) return
    setStatus('uploading')
    setErrorMsg(null)

    try {
      const url = await uploadToDrive(photo, token.access_token)
      setDriveUrl(url)

      await appendToSheet(token.access_token, [item, area, description, url])

      setStatus('success')
      setPhoto(null)
      setPreview(null)
      setItem('')
      setArea('')
      setDescription('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : String(err))
    }
  }

  const canSubmit = !!photo && isSignedIn && status !== 'uploading'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white px-4 py-4 shadow">
        <h1 className="text-xl font-bold tracking-tight">Field Notes</h1>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-5 max-w-lg mx-auto w-full">
        {!isSignedIn ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-gray-500 text-sm text-center">
              Sign in with your Google account to save photos to Drive and notes to Sheets.
            </p>
            <button
              onClick={signIn}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:bg-blue-700 active:bg-blue-800 transition"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <PhotoCapture photo={photo} preview={preview} onCapture={handleCapture} />

            <NoteForm
              item={item}
              area={area}
              description={description}
              onItemChange={setItem}
              onAreaChange={setArea}
              onDescriptionChange={setDescription}
            />

            <StatusBanner status={status} driveUrl={driveUrl} errorMsg={errorMsg} />

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow disabled:opacity-40 hover:bg-blue-700 active:bg-blue-800 transition"
            >
              {status === 'uploading' ? 'Saving…' : 'Save to Drive & Sheets'}
            </button>

            <button
              onClick={signIn}
              className="text-xs text-gray-400 text-center underline"
            >
              Refresh Google token
            </button>
          </>
        )}
      </main>
    </div>
  )
}
