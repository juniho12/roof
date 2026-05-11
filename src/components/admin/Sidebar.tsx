'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ImageIcon,
  SlidersHorizontal,
  Users,
  Film,
  Link2,
  Share2,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero Section', icon: ImageIcon },
  { href: '/admin/slider', label: 'Slider de Imagens', icon: SlidersHorizontal },
  { href: '/admin/produtora', label: 'Seção Produtora', icon: ImageIcon },
  { href: '/admin/videos', label: 'Carrossel de Vídeos', icon: Film },
  { href: '/admin/botoes', label: 'Botões e Links', icon: Link2 },
  { href: '/admin/footer-links', label: 'Links do Footer', icon: Share2 },
  { href: '/admin/footer-settings', label: 'Config. Footer', icon: Settings },
  { href: '/admin/users', label: 'Usuários', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-roof-sidebar flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl text-roof-red">ROOF!</span>
          <span className="text-xs text-white/60 uppercase tracking-widest">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-roof-red text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
