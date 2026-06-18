import { useEffect, useState } from 'react'
import { getSheetRows } from '../hooks/useSheetsRead'

interface Props {
  accessToken: string
}

interface Item {
  item: string
  area: string
  description: string
  imageUrl: string
}

export function ListView({ accessToken }: Props) {
  const [rows, setRows] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSheetRows(accessToken)
      .then((data) =>
        setRows(
          data.map(([item = '', area = '', description = '', imageUrl = '']) => ({
            item,
            area,
            description,
            imageUrl,
          })),
        ),
      )
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading items…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-red-500 text-sm text-center">{error}</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No items logged yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {row.imageUrl && (
            <img
              src={row.imageUrl}
              alt={row.item}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{row.item}</span>
              {row.area && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {row.area}
                </span>
              )}
            </div>
            {row.description && (
              <p className="text-sm text-gray-600">{row.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
