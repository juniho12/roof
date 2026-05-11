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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link) => (
          <div key={link.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SocialIcon name={link.icon_name} size={22} className="text-roof-red" />
                <span className="text-gray-900 font-bold text-base">{link.name}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-gray-500 text-xs">{link.is_active ? 'Ativo' : 'Inativo'}</span>
                <div
                  onClick={() => updateLink(link.id, 'is_active', !link.is_active)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${link.is_active ? 'bg-roof-red' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${link.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
            <label className="text-gray-600 text-xs font-medium block mb-1">URL do link</label>
            <input
              type="url"
              defaultValue={link.link_url ?? ''}
              onBlur={(e) => updateLink(link.id, 'link_url', e.target.value)}
              className="w-full bg-white text-gray-900 text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-roof-red"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
