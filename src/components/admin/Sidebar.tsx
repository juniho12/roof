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
    <aside className="w-60 min-h-screen bg-roof-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <span className="font-bebas text-2xl">
          <span className="text-roof-red">ROOF!</span>
          <span className="text-white/60 text-base ml-1">ADMIN</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-roof-red text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors w-full"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
