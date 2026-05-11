'use client'
import Image from 'next/image'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'

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
  onMove?: (id: string, direction: 'up' | 'down') => void
  onLinkChange?: (id: string, url: string) => void
  showLinkField?: boolean
}

export function SortableImageList({ items, onToggle, onDelete, onMove, onLinkChange, showLinkField }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="flex items-center gap-5 bg-white border border-gray-200 rounded-lg p-5"
        >
          {onMove && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => onMove(item.id, 'up')}
                disabled={idx === 0}
                aria-label="Mover para cima"
                className="text-gray-400 hover:text-roof-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={20} />
              </button>
              <button
                onClick={() => onMove(item.id, 'down')}
                disabled={idx === items.length - 1}
                aria-label="Mover para baixo"
                className="text-gray-400 hover:text-roof-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowDown size={20} />
              </button>
            </div>
          )}
          <Image quality={60}
            src={item.image_url}
            alt={item.alt_text ?? ''}
            width={160}
            height={96}
            className="object-cover h-24 w-40 flex-shrink-0 rounded-md"
          />
          <div className="flex-1 min-w-0 space-y-3">
            {showLinkField && onLinkChange && (
              <div>
                <label className="text-gray-600 text-xs font-medium block mb-1">URL de destino</label>
                <input
                  type="url"
                  defaultValue={item.link_url ?? ''}
                  placeholder="https://..."
                  onBlur={(e) => onLinkChange(item.id, e.target.value)}
                  className="w-full bg-white text-gray-900 text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-roof-red"
                />
              </div>
            )}
            <p className="text-gray-500 text-xs truncate">{item.image_url.split('/').pop()}</p>
          </div>
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(e) => onToggle(item.id, e.target.checked)}
                className="accent-roof-red w-4 h-4"
              />
              <span className="text-gray-700 text-sm font-medium">Ativo</span>
            </label>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-roof-red text-white rounded-md p-2.5 hover:bg-red-700 transition-colors"
              aria-label="Deletar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
