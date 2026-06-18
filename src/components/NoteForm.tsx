interface Props {
  item: string
  area: string
  description: string
  onItemChange: (v: string) => void
  onAreaChange: (v: string) => void
  onDescriptionChange: (v: string) => void
}

export function NoteForm({ item, area, description, onItemChange, onAreaChange, onDescriptionChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
        <input
          type="text"
          value={item}
          onChange={(e) => onItemChange(e.target.value)}
          placeholder="e.g. Cooktop / bench"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
        <input
          type="text"
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          placeholder="e.g. Kitchen"
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the issue…"
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>
    </div>
  )
}
