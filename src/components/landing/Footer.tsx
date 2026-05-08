import { SocialIcon } from '@/components/ui/SocialIcon'
import type { FooterSettings, FooterLink } from '@/types/database'

type Props = {
  settings: FooterSettings
  links: FooterLink[]
}

export function Footer({ settings, links }: Props) {
  return (
    <footer className="bg-roof-dark py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div>
          <span className="font-bebas text-white text-3xl tracking-wider">
            ROOF<span className="text-roof-red">!</span> PRODUTORA
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center gap-1 text-white/60 text-xs text-center">
          {settings.email && <span>{settings.email}</span>}
          {settings.cnpj && <span>CNPJ: {settings.cnpj}</span>}
          <span>© 2026 ROOF! Produtora. Todos os direitos reservados.</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.link_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label={link.name}
            >
              <SocialIcon name={link.icon_name} size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
