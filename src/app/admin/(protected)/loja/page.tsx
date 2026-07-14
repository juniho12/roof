'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PageHeader } from '@/components/admin/PageHeader'
import { Save } from 'lucide-react'
import type { StoreSettings } from '@/types/database'

type ImageCol = 'image_1_url' | 'image_2_url' | 'image_3_url'

export default function LojaPage() {
  const [store, setStore] = useState<StoreSettings | null>(null)
  const [link, setLink] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('store_settings').select('*').single().then(({ data }) => {
      if (data) {
        setStore(data)
        setLink(data.link_url ?? '')
      }
    })
  }, [])

  async function saveLink() {
    if (!store) return
    await supabase
      .from('store_settings')
      .update({ link_url: link, updated_at: new Date().toISOString() })
      .eq('id', store.id)
    setStore((prev) => (prev ? { ...prev, link_url: link } : prev))
    alert('Link salvo!')
  }

  async function updateImage(col: ImageCol, url: string) {
    if (!store) return
    await supabase
      .from('store_settings')
      .update({ [col]: url, updated_at: new Date().toISOString() })
      .eq('id', store.id)
    setStore((prev) => (prev ? { ...prev, [col]: url } : prev))
  }

  if (!store) {
    return <div className="text-gray-500">Carregando...</div>
  }

  const slots: { col: ImageCol; url: string | null; label: string }[] = [
    { col: 'image_1_url', url: store.image_1_url, label: 'Imagem 1' },
    { col: 'image_2_url', url: store.image_2_url, label: 'Imagem 2' },
    { col: 'image_3_url', url: store.image_3_url, label: 'Imagem 3' },
  ]

  return (
    <div>
      <PageHeader
        title="Loja ROOF"
        description="Gerencie o link da loja e as 3 imagens da seção Loja na landing page"
      />

      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h2 className="font-display text-3xl text-gray-900 mb-1">Link da Loja</h2>
        <p className="text-gray-500 text-sm mb-6">
          Usado no botão LOJA ROOF da Hero e ao clicar nas imagens da seção Loja
        </p>
        <div className="mb-6">
          <label className="text-gray-600 text-xs font-medium block mb-1">URL</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white text-gray-900 px-3 py-2.5 border border-gray-200 rounded-md outline-none focus:border-roof-red text-sm"
          />
        </div>
        <button
          onClick={saveLink}
          className="flex items-center gap-2 bg-roof-red text-white rounded-md px-5 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors"
        >
          <Save size={16} />
          Salvar Link
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h2 className="font-display text-3xl text-gray-900 mb-1">Imagens</h2>
        <p className="text-gray-500 text-sm mb-6">As 3 imagens exibidas na seção Loja</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <ImageUploader
              key={slot.col}
              label={slot.label}
              currentUrl={slot.url}
              bucket="store-images"
              onUploaded={(url) => updateImage(slot.col, url)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
