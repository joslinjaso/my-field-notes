interface Props {
  status: 'idle' | 'uploading' | 'success' | 'error'
  driveUrl: string | null
  errorMsg: string | null
}

export function StatusBanner({ status, driveUrl, errorMsg }: Props) {
  if (status === 'uploading') {
    return (
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
        <span className="animate-spin">⏳</span>
        Uploading photo and saving note…
      </div>
    )
  }

  if (status === 'success' && driveUrl) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
        <p className="font-medium">Saved!</p>
        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-green-600 break-all"
        >
          View photo in Drive
        </a>
      </div>
    )
  }

  if (status === 'error' && errorMsg) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
        <p className="font-medium">Something went wrong</p>
        <p className="text-xs mt-1 break-all">{errorMsg}</p>
      </div>
    )
  }

  return null
}
