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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Imagens no Slider" count={sliderCount ?? 0} icon={SlidersHorizontal} />
        <DashboardCard label="VÃ­deos no Carrossel" count={videosCount ?? 0} icon={Film} color="#f97316" />
        <DashboardCard label="BotÃµes" count={buttonsCount ?? 0} icon={Link2} color="#22c55e" />
        <DashboardCard label="Links" count={linksCount ?? 0} icon={Share2} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="font-display text-white text-2xl mb-4">Status do Sistema</h2>
          <p className="text-white/50 text-sm mb-3">InformaÃ§Ãµes sobre sua conta</p>
          <div className="flex items-center justify-between border-t border-white/10 py-3">
            <span className="text-white/50 text-sm">E-mail</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 py-3">
            <span className="text-white/50 text-sm">NÃ­vel de Acesso</span>
            <span className="text-roof-red font-bold text-sm">Administrador</span>
          </div>
        </div>

        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="font-display text-white text-2xl mb-4">AÃ§Ãµes RÃ¡pidas</h2>
          <p className="text-white/50 text-sm">
            Use o menu lateral para acessar as diferentes seÃ§Ãµes de gerenciamento de conteÃºdo.
          </p>
        </div>
      </div>
    </div>
  )
}
