'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/admin/PageHeader'
import { Save, Phone, Mail, Building2 } from 'lucide-react'
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
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="font-display text-3xl text-gray-900 mb-1">Informações de Contato</h2>
        <p className="text-gray-500 text-sm mb-6">Configure o telefone, e-mail e CNPJ que aparecem no footer da Landing Page</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1.5 flex items-center gap-2">
              <Phone size={14} /> Telefone
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white text-gray-900 px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red text-sm" />
          </div>
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1.5 flex items-center gap-2">
              <Mail size={14} /> E-mail
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white text-gray-900 px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red text-sm" />
          </div>
        </div>
        <div className="mb-7">
          <label className="text-gray-700 text-sm font-medium mb-1.5 flex items-center gap-2">
            <Building2 size={14} /> CNPJ
          </label>
          <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="w-full bg-white text-gray-900 px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-roof-red text-sm" />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-roof-red text-white rounded-md px-6 py-3 font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}
