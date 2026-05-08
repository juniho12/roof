'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ToggleRow } from '@/components/admin/ToggleRow'
import { PageHeader } from '@/components/admin/PageHeader'
import type { HeroButton, HeroLink } from '@/types/database'

export default function BotoesPage() {
  const [buttons, setButtons] = useState<HeroButton[]>([])
  const [links, setLinks] = useState<HeroLink[]>([])
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('hero_buttons').select('*').order('display_order'),
      supabase.from('hero_links').select('*').order('display_order'),
    ]).then(([{ data: btns }, { data: lnks }]) => {
      setButtons(btns ?? [])
      setLinks(lnks ?? [])
    })
  }, [])

  async function updateButton(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('hero_buttons').update({ [field]: value }).eq('id', id)
    setButtons((prev) => prev.map((b) => b.id === id ? { ...b, [field]: value } : b))
  }

  async function updateLink(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('hero_links').update({ [field]: value }).eq('id', id)
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  return (
    <div>
      <PageHeader title="Botões e Links" description="Gerencie as URLs e status de todos os botões e links" />
      <div className="max-w-2xl space-y-8">
        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="text-white font-bold mb-2">Botões</h2>
          <p className="text-white/40 text-xs mb-4">Botões com imagem que aparecem na LP</p>
          {buttons.map((btn) => (
            <ToggleRow
              key={btn.id}
              label={btn.name}
              value={btn.link_url ?? ''}
              placeholder="URL de destino"
              active={btn.is_active}
              onChange={(url) => updateButton(btn.id, 'link_url', url)}
              onToggle={(active) => updateButton(btn.id, 'is_active', active)}
            />
          ))}
        </div>
        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="text-white font-bold mb-2">Links de Texto</h2>
          <p className="text-white/40 text-xs mb-4">Links que aparecem na LP</p>
          {links.map((link) => (
            <ToggleRow
              key={link.id}
              label={link.text}
              value={link.link_url ?? ''}
              placeholder="URL de destino"
              active={link.is_active}
              onChange={(url) => updateLink(link.id, 'link_url', url)}
              onToggle={(active) => updateLink(link.id, 'is_active', active)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
