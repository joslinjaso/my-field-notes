import { useRef } from 'react'

interface Props {
  photo: File | null
  preview: string | null
  onCapture: (file: File, preview: string) => void
}

export function PhotoCapture({ photo, preview, onCapture }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onCapture(file, url)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-xl shadow"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full"
          >
            Retake
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-xl p-10 text-blue-500 hover:bg-blue-50 active:bg-blue-100 transition"
        >
          <span className="text-5xl">📷</span>
          <span className="font-medium">Take Photo</span>
        </button>
      )}
      {photo && (
        <p className="text-xs text-gray-400">
          {photo.name} · {(photo.size / 1024).toFixed(0)} KB
        </p>
      )}
    </div>
  )
}
