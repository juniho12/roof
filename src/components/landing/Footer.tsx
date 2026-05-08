import Image from 'next/image'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { FooterSettings, FooterLink } from '@/types/database'

type Props = {
  settings: FooterSettings
  links: FooterLink[]
  logoUrl?: string | null
}

export function Footer({ settings, links, logoUrl }: Props) {
  return (
    <footer className="bg-[#0a0002] border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="ROOF! Produtora"
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-2xl text-white">
                ROOF<span className="text-roof-red">!</span> PRODUTORA
              </span>
            )}
            <div className="text-white/60 text-sm">
              {settings.email && <div>{settings.email}</div>}
              {settings.cnpj && <div>CNPJ: {settings.cnpj}</div>}
              {settings.phone && <div>{settings.phone}</div>}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.link_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors hover:scale-110"
                aria-label={link.name}
              >
                <SocialIcon name={link.icon_name} size={20} />
              </a>
            ))}
          </div>

          <div className="text-sm text-white/40 md:text-right">
            © 2026 ROOF! Produtora. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
