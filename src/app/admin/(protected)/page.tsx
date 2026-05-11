import { createClient } from '@/lib/supabase/server'
import { DashboardCard } from '@/components/admin/DashboardCard'
import { PageHeader } from '@/components/admin/PageHeader'
import { SlidersHorizontal, Film, Link2, Share2 } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: sliderCount },
    { count: videosCount },
    { count: buttonsCount },
    { count: linksCount },
    authResult,
  ] = await Promise.all([
    supabase.from('slider_images').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('video_carousel').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('hero_buttons').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('hero_links').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.auth.getUser(),
  ])

  const user = authResult.data.user

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo, ${user?.email}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard label="Imagens no Slider" count={sliderCount ?? 0} icon={SlidersHorizontal} color="#3b82f6" />
        <DashboardCard label="Vídeos no Carrossel" count={videosCount ?? 0} icon={Film} color="#a855f7" />
        <DashboardCard label="Botões" count={buttonsCount ?? 0} icon={Link2} color="#22c55e" />
        <DashboardCard label="Links" count={linksCount ?? 0} icon={Share2} color="#f97316" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-display text-2xl text-gray-900">Status do Sistema</h2>
            <p className="text-gray-500 text-sm mt-1">Informações sobre sua conta</p>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">E-mail:</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nível de Acesso:</span>
              <span className="text-roof-red font-semibold">Administrador</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-display text-2xl text-gray-900">Ações Rápidas</h2>
            <p className="text-gray-500 text-sm mt-1">Gerenciar conteúdo da Landing Page</p>
          </div>
          <div className="p-6">
            <p className="text-gray-600 text-sm">
              Use o menu lateral para acessar as diferentes seções de gerenciamento de conteúdo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
