'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SortableImageList } from '@/components/admin/SortableImageList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus, Save } from 'lucide-react'
import type { SliderImage, ContentSectionSettings } from '@/types/database'

export default function SliderPage() {
  const [images, setImages] = useState<SliderImage[]>([])
  const [section, setSection] = useState<ContentSectionSettings | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('slider_images').select('*').order('display_order'),
      supabase.from('content_section_settings')
        .select('*')
        .eq('title', 'VEJA O QUE TE ESPERA NAS PRÓXIMAS EDIÇÕES')
        .single(),
    ]).then(([{ data: imgs }, { data: sec }]) => {
      setImages(imgs ?? [])
      if (sec) {
        setSection(sec)
        setTitle(sec.title)
        setSubtitle(sec.subtitle ?? '')
      }
    })
  }, [])

  async function saveText() {
    if (!section) return
    await supabase
      .from('content_section_settings')
      .update({ title, subtitle, updated_at: new Date().toISOString() })
      .eq('id', section.id)
    alert('Textos salvos!')
  }

  async function toggleImage(id: string, active: boolean) {
    await supabase.from('slider_images').update({ is_active: active }).eq('id', id)
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, is_active: active } : img))
  }

  async function deleteImage(id: string) {
    if (!confirm('Deletar imagem?')) return
    await supabase.from('slider_images').delete().eq('id', id)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function updateLink(id: string, url: string) {
    await supabase.from('slider_images').update({ link_url: url }).eq('id', id)
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `slider-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('slider-images').upload(filename, file)
    if (error) { alert(error.message); setUploading(false); return }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slider-images/${filename}`
    const maxOrder = Math.max(0, ...images.map((i) => i.display_order))
    const { data } = await supabase
      .from('slider_images')
      .insert({ image_url: url, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setImages((prev) => [...prev, data])
    setUploading(false)
  }

  return (
    <div>
      <PageHeader
        title="Slider de Imagens"
        description="Gerencie as imagens e textos do slider"
      />

      <div className="bg-roof-sidebar border border-white/10 p-6 mb-6 max-w-2xl">
        <h2 className="text-white font-bold mb-4">Textos da Seção</h2>
        <div className="flex flex-col gap-3 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtítulo"
            className="bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
        </div>
        <button
          onClick={saveText}
          className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors"
        >
          <Save size={14} />
          Salvar Textos
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Imagens</h2>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus size={14} />
              {uploading ? 'Enviando...' : 'Adicionar Imagem'}
            </button>
          </div>
        </div>
        <SortableImageList
          items={images}
          onToggle={toggleImage}
          onDelete={deleteImage}
          onLinkChange={updateLink}
          showLinkField
        />
      </div>
    </div>
  )
}
