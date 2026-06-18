interface Coords {
  lat: number
  lng: number
}

interface Props {
  note: string
  coords: Coords | null
  locError: string | null
  locLoading: boolean
  onNoteChange: (v: string) => void
  onGetLocation: () => void
}

export function NoteForm({ note, coords, locError, locLoading, onNoteChange, onGetLocation }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="What's happening here?"
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        {coords ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-sm text-green-700">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
            <button
              type="button"
              onClick={onGetLocation}
              className="text-xs text-green-600 underline"
            >
              Refresh
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onGetLocation}
            disabled={locLoading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 transition"
          >
            {locLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📍</span>
            )}
            {locLoading ? 'Getting location…' : 'Use my location'}
          </button>
        )}
        {locError && <p className="text-xs text-red-500 mt-1">{locError}</p>}
      </div>
    </div>
  )
}
