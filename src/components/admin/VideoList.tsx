'use client'
import Image from 'next/image'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

type Props = {
  items: VideoCarouselItem[]
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onMove?: (id: string, direction: 'up' | 'down') => void
  onUpdate?: (id: string, fields: { title?: string | null; video_url?: string }) => void
}

export function VideoList({ items, onToggle, onDelete, onMove, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="flex items-center gap-5 bg-white border border-gray-200 rounded-lg p-5">
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
          {item.thumbnail_url && (
            <Image
              src={item.thumbnail_url}
              alt={item.title ?? 'video'}
              width={160}
              height={96}
              className="object-cover h-24 w-40 flex-shrink-0 rounded-md"
            />
          )}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <label className="text-gray-600 text-xs font-medium block mb-1">Título</label>
              <input
                type="text"
                defaultValue={item.title ?? ''}
                placeholder="Título do vídeo"
                onBlur={(e) => onUpdate?.(item.id, { title: e.target.value || null })}
                className="w-full bg-white text-gray-900 text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-roof-red"
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs font-medium block mb-1">URL</label>
              <input
                type="url"
                defaultValue={item.video_url}
                placeholder="https://youtu.be/..."
                onBlur={(e) => onUpdate?.(item.id, { video_url: e.target.value })}
                className="w-full bg-white text-gray-900 text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-roof-red"
              />
            </div>
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
