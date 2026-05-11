'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SortableImageList } from '@/components/admin/SortableImageList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus } from 'lucide-react'
import type { AboutImage } from '@/types/database'

export default function ProdutoraAdminPage() {
  const [images, setImages] = useState<AboutImage[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('about_images').select('*').order('display_order').then(({ data }) => {
      setImages(data ?? [])
    })
  }, [])

  async function toggleImage(id: string, active: boolean) {
    await supabase.from('about_images').update({ is_active: active }).eq('id', id)
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, is_active: active } : img))
  }

  async function deleteImage(id: string) {
    if (!confirm('Deletar imagem?')) return
    await supabase.from('about_images').delete().eq('id', id)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function moveImage(id: string, direction: 'up' | 'down') {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex((i) => i.id === id)
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[targetIdx]
    await supabase.from('about_images').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('about_images').update({ display_order: a.display_order }).eq('id', b.id)
    sorted[idx] = { ...b, display_order: a.display_order }
    sorted[targetIdx] = { ...a, display_order: b.display_order }
    setImages(sorted.sort((x, y) => x.display_order - y.display_order))
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('about-images').upload(filename, file)
    if (error) { alert(error.message); setUploading(false); return }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/about-images/${filename}`
    const maxOrder = Math.max(0, ...images.map((i) => i.display_order))
    const { data } = await supabase
      .from('about_images')
      .insert({ image_url: url, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setImages((prev) => [...prev, data])
    setUploading(false)
  }

  return (
    <div>
      <PageHeader
        title="Seção A Produtora"
        description="Gerencie as imagens da seção A Produtora na landing page"
      />
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl text-gray-900">Imagens ({images.length})</h2>
            <p className="text-gray-500 text-sm mt-1">Adicione, remova ou reordene as imagens da seção</p>
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-roof-red text-white rounded-md px-5 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              {uploading ? 'Enviando...' : 'Adicionar Imagem'}
            </button>
          </div>
        </div>
        <SortableImageList items={images} onToggle={toggleImage} onDelete={deleteImage} onMove={moveImage} />
      </div>
    </div>
  )
}
