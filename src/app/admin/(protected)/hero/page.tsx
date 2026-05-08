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
    return <div className="text-white/50">Carregando...</div>
  }

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Gerencie o conteúdo da seção principal da Landing Page"
      />
      <div className="bg-roof-sidebar border border-white/10 p-6 max-w-2xl">
        <ImageUploader
          label="Logo"
          currentUrl={hero.logo_url}
          bucket="hero-images"
          onUploaded={(url) => updateField('logo_url', url)}
        />
        <ImageUploader
          label="Imagem de Fundo"
          currentUrl={hero.background_image_url}
          bucket="hero-images"
          onUploaded={(url) => updateField('background_image_url', url)}
        />
      </div>
    </div>
  )
}
