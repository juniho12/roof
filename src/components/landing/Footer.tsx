import Image from 'next/image'
import type { FooterSettings } from '@/types/database'

type Props = {
  settings: FooterSettings
  logoUrl?: string | null
}

export function Footer({ settings, logoUrl }: Props) {
  return (
    <footer className="bg-[#0a0002] border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="ROOF! Produtora"
                width={240}
                height={80}
                className="h-10 w-auto object-contain"
                loading="lazy"
                sizes="240px"
              />
            ) : (
              <span className="font-display text-2xl text-white">
                ROOF<span className="text-roof-red">!</span> PRODUTORA
              </span>
            )}
            <div className="text-white/60 text-sm">
              {settings.email && <p>{settings.email}</p>}
              {settings.phone && <p>{settings.phone}</p>}
            </div>
          </div>

          <div className="flex items-center justify-center">
            {settings.cnpj && (
              <p className="text-white/60 text-sm">CNPJ: {settings.cnpj}</p>
            )}
          </div>

          <div className="text-sm text-white/40 md:text-right">
            <p>© 2026 Roof! Produtora. Todos os direitos reservados.</p>
            <p className="text-[11px] mt-1">
              Developed by{' '}
              <a
                href="https://www.emiworks.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-roof-red"
              >
                emiworks.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
