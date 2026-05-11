'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PageHeader } from '@/components/admin/PageHeader'
import type { HeroSection } from '@/types/database'

export default function HeroPage() {
  const [hero, setHero] = useState<HeroSection | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('hero_section').select('*').single().then(({ data }) => {
      if (data) setHero(data)
    })
  }, [])

  async function updateField(field: 'logo_url' | 'background_image_url', url: string) {
    if (!hero) return
    await supabase
      .from('hero_section')
      .update({ [field]: url, updated_at: new Date().toISOString() })
      .eq('id', hero.id)
    setHero((prev) => prev ? { ...prev, [field]: url } : prev)
  }

  if (!hero) {
    return <div className="text-gray-500">Carregando...</div>
  }

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Gerencie o conteúdo da seção principal da Landing Page"
      />
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="font-display text-3xl text-gray-900 mb-1">Logo</h2>
          <p className="text-gray-500 text-sm mb-6">Logo exibido na Hero Section</p>
          <ImageUploader
            label="Logo"
            currentUrl={hero.logo_url}
            bucket="hero-images"
            onUploaded={(url) => updateField('logo_url', url)}
          />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="font-display text-3xl text-gray-900 mb-1">Imagem de Fundo</h2>
          <p className="text-gray-500 text-sm mb-6">Imagem de fundo da Hero Section</p>
          <ImageUploader
            label="Imagem de Fundo"
            currentUrl={hero.background_image_url}
            bucket="hero-images"
            onUploaded={(url) => updateField('background_image_url', url)}
          />
        </div>
      </div>
    </div>
  )
}
