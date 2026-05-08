'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { PageHeader } from '@/components/admin/PageHeader'
import type { FooterLink } from '@/types/database'

export default function FooterLinksPage() {
  const [links, setLinks] = useState<FooterLink[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('footer_links').select('*').order('display_order').then(({ data }) => {
      setLinks(data ?? [])
    })
  }, [])

  async function updateLink(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('footer_links').update({ [field]: value }).eq('id', id)
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  return (
    <div>
      <PageHeader
        title="Links do Footer"
        description="Gerencie as redes sociais do rodapé. Links sem URL não serão exibidos."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {links.map((link) => (
          <div key={link.id} className="bg-roof-sidebar border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SocialIcon name={link.icon_name} size={20} className="text-roof-red" />
                <span className="text-white font-bold text-sm">{link.name}</span>
              </div>
              <label className="flex items-center gap-1 cursor-pointer">
                <span className="text-white/40 text-xs">{link.is_active ? 'Ativo' : 'Inativo'}</span>
                <div
                  onClick={() => updateLink(link.id, 'is_active', !link.is_active)}
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${link.is_active ? 'bg-roof-red' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${link.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
            <p className="text-white/40 text-xs mb-1">URL do link</p>
            <input
              type="url"
              defaultValue={link.link_url ?? ''}
              onBlur={(e) => updateLink(link.id, 'link_url', e.target.value)}
              className="w-full bg-roof-dark text-white/70 text-xs px-2 py-2 border border-white/10 outline-none focus:border-roof-red"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
