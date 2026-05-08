'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/admin/PageHeader'
import { Save } from 'lucide-react'
import type { FooterSettings } from '@/types/database'

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('footer_settings').select('*').single().then(({ data }) => {
      if (data) {
        setSettings(data)
        setPhone(data.phone ?? '')
        setEmail(data.email ?? '')
        setCnpj(data.cnpj ?? '')
      }
    })
  }, [])

  async function save() {
    if (!settings) return
    setSaving(true)
    await supabase
      .from('footer_settings')
      .update({ phone, email, cnpj, updated_at: new Date().toISOString() })
      .eq('id', settings.id)
    setSaving(false)
    alert('Configurações salvas!')
  }

  return (
    <div>
      <PageHeader title="Configurações do Footer" description="Gerencie as informações de contato exibidas no rodapé" />
      <div className="bg-roof-sidebar border border-white/10 p-6 max-w-xl">
        <h2 className="text-white font-bold mb-6">Informações de Contato</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-white/50 text-xs mb-1 block">Telefone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm" />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">E-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm" />
          </div>
        </div>
        <div className="mb-6">
          <label className="text-white/50 text-xs mb-1 block">CNPJ</label>
          <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm" />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-roof-red text-white px-6 py-3 font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}
