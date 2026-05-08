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
    <div className="border-b border-white/10 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">{label}</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-white/50 text-xs">{active ? 'Ativo' : 'Inativo'}</span>
          <div
            onClick={() => onToggle(!active)}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-roof-red' : 'bg-white/20'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>
      <input
        type="url"
        value={value}
        placeholder={placeholder ?? 'URL'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-roof-dark text-white/70 text-xs px-3 py-2 border border-white/10 outline-none focus:border-roof-red"
      />
    </div>
  )
}
