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
    if (!confirm('Deletar vídeo?')) return
    await supabase.from('video_carousel').delete().eq('id', id)
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  async function updateVideo(id: string, fields: { title?: string | null; video_url?: string }) {
    const patch: Record<string, unknown> = { ...fields }
    if (fields.video_url !== undefined) {
      const videoId = getYouTubeId(fields.video_url)
      patch.thumbnail_url = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
    }
    await supabase.from('video_carousel').update(patch).eq('id', id)
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } as VideoCarouselItem : v))
    )
  }

  async function moveVideo(id: string, direction: 'up' | 'down') {
    const sorted = [...videos].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex((v) => v.id === id)
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[targetIdx]
    await supabase.from('video_carousel').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('video_carousel').update({ display_order: a.display_order }).eq('id', b.id)
    sorted[idx] = { ...b, display_order: a.display_order }
    sorted[targetIdx] = { ...a, display_order: b.display_order }
    setVideos(sorted.sort((x, y) => x.display_order - y.display_order))
  }

  return (
    <div>
      <PageHeader title="Carrossel de Vídeos" description="Gerencie os vídeos do YouTube na landing page" />
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl text-gray-900">Vídeos</h2>
            <p className="text-gray-500 text-sm mt-1">Adicione, remova ou reordene os vídeos do carrossel</p>
          </div>
          <button
            onClick={addVideo}
            disabled={adding || !newUrl}
            className="flex items-center gap-2 bg-roof-red text-white rounded-md px-5 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            Adicionar Vídeo
          </button>
        </div>
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Cole a URL do YouTube e clique em Adicionar Vídeo (youtu.be/... ou youtube.com/watch?v=...)"
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 mb-6 border border-gray-200 rounded-md outline-none focus:border-roof-red text-sm"
        />
        <VideoList items={videos} onToggle={toggleVideo} onDelete={deleteVideo} onMove={moveVideo} onUpdate={updateVideo} />
      </div>
    </div>
  )
}
