'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VideoList } from '@/components/admin/VideoList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoCarouselItem[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('video_carousel').select('*').order('display_order').then(({ data }) => {
      setVideos(data ?? [])
    })
  }, [])

  async function addVideo() {
    if (!newUrl.trim()) return
    setAdding(true)
    const videoId = getYouTubeId(newUrl)
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
    const maxOrder = Math.max(0, ...videos.map((v) => v.display_order))
    const { data } = await supabase
      .from('video_carousel')
      .insert({ video_url: newUrl, thumbnail_url: thumbnail, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setVideos((prev) => [...prev, data])
    setNewUrl('')
    setAdding(false)
  }

  async function toggleVideo(id: string, active: boolean) {
    await supabase.from('video_carousel').update({ is_active: active }).eq('id', id)
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, is_active: active } : v))
  }

  async function deleteVideo(id: string) {
    if (!confirm('Deletar vÃ­deo?')) return
    await supabase.from('video_carousel').delete().eq('id', id)
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div>
      <PageHeader title="Carrossel de VÃ­deos" description="Gerencie os vÃ­deos do YouTube na landing page" />
      <div className="bg-roof-sidebar border border-white/10 p-6 mb-6 max-w-2xl">
        <h2 className="text-white font-bold mb-3">Adicionar VÃ­deo</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL do YouTube (youtu.be/... ou youtube.com/watch?v=...)"
            className="flex-1 bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
          <button
            onClick={addVideo}
            disabled={adding || !newUrl}
            className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>
      </div>
      <div className="max-w-2xl">
        <h2 className="text-white font-bold mb-4">VÃ­deos</h2>
        <VideoList items={videos} onToggle={toggleVideo} onDelete={deleteVideo} />
      </div>
    </div>
  )
}
