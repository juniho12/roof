'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

type Props = {
  items: VideoCarouselItem[]
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function VideoList({ items, onToggle, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 bg-roof-sidebar border border-white/10 p-3">
          {item.thumbnail_url && (
            <Image
              src={item.thumbnail_url}
              alt={item.title ?? 'video'}
              width={90}
              height={56}
              className="object-cover h-14 w-24 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs truncate">{item.video_url}</p>
            {item.title && <p className="text-white/40 text-xs mt-1">{item.title}</p>}
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
