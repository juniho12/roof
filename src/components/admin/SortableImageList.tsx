'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

type ImageItem = {
  id: string
  image_url: string
  alt_text?: string | null
  link_url?: string | null
  is_active: boolean
  display_order: number
}

type Props = {
  items: ImageItem[]
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onLinkChange?: (id: string, url: string) => void
  showLinkField?: boolean
}

export function SortableImageList({ items, onToggle, onDelete, onLinkChange, showLinkField }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-roof-sidebar border border-white/10 p-3"
        >
          <Image
            src={item.image_url}
            alt={item.alt_text ?? ''}
            width={80}
            height={56}
            className="object-cover h-14 w-20 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {showLinkField && onLinkChange && (
              <input
                type="url"
                defaultValue={item.link_url ?? ''}
                placeholder="URL de destino"
                onBlur={(e) => onLinkChange(item.id, e.target.value)}
                className="w-full bg-transparent text-white/70 text-xs border-b border-white/10 focus:border-roof-red outline-none py-1 mb-1"
              />
            )}
            <p className="text-white/40 text-xs truncate">{item.image_url.split('/').pop()}</p>
          </div>
          <label className="flex items-center gap-1 cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={item.is_active}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              className="accent-roof-red"
            />
            <span className="text-white/60 text-xs">Ativo</span>
          </label>
          <button
            onClick={() => onDelete(item.id)}
            className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
