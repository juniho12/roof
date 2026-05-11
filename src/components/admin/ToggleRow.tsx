type Props = {
  label: string
  value: string
  placeholder?: string
  active: boolean
  onChange: (value: string) => void
  onToggle: (active: boolean) => void
}

export function ToggleRow({ label, value, placeholder, active, onChange, onToggle }: Props) {
  return (
    <div className="border-t border-gray-200 first:border-t-0 py-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-900 text-base font-semibold">{label}</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-gray-500 text-xs">{active ? 'Ativo' : 'Inativo'}</span>
          <div
            onClick={() => onToggle(!active)}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-roof-red' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>
      <input
        type="url"
        value={value}
        placeholder={placeholder ?? 'URL'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white text-gray-900 text-sm px-3 py-2.5 border border-gray-200 rounded-md outline-none focus:border-roof-red"
      />
    </div>
  )
}
