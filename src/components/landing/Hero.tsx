import Image from 'next/image'
import { Ticket, QrCode, Users, CircleHelp, ShoppingBag } from 'lucide-react'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { HeroSection, HeroButton, HeroLink, FooterLink } from '@/types/database'

type Props = {
  hero: HeroSection
  buttons: HeroButton[]
  links: HeroLink[]
  socialLinks: FooterLink[]
  storeUrl: string | null
}

export function Hero({ hero, buttons, links, socialLinks, storeUrl }: Props) {
  const [btn1, btn2] = buttons
  const [link1, link2] = links

  const renderButton = (btn: HeroButton | undefined, variant: 'light' | 'dark') => {
    const isActive = btn?.is_active && btn?.link_url
    const lightActive = 'bg-white text-black cursor-pointer'
    const lightInactive = 'bg-white/20 text-white/50 cursor-not-allowed pointer-events-none'
    const darkActive = 'bg-black text-white cursor-pointer border border-white/20'
    const darkInactive = 'bg-black/50 text-white/50 cursor-not-allowed pointer-events-none'
    const colorClasses =
      variant === 'light'
        ? isActive ? lightActive : lightInactive
        : isActive ? darkActive : darkInactive

    return (
      <a
        href={btn?.link_url ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all hover:scale-105 ${colorClasses}`}
      >
        {btn?.image_url ? (
          <Image quality={60}
            src={btn.image_url}
            alt=""
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            loading="lazy"
          />
        ) : variant === 'light' ? (
          <Ticket className="w-6 h-6" />
        ) : (
          <QrCode className="w-6 h-6" />
        )}
        <div className="text-left">
          <div className="text-xs uppercase tracking-wide opacity-70">
            {variant === 'light' ? 'Ingressos Oficiais' : 'Sem Taxa'}
          </div>
          <div className="font-bold">{variant === 'light' ? 'BLACKTAG' : 'VIA PIX'}</div>
        </div>
      </a>
    )
  }

  const renderLink = (link: HeroLink | undefined, Icon: typeof Users, fallback: string) => {
    const isActive = link?.is_active && link?.link_url
    const colorClasses = isActive
      ? 'bg-white/10 text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm'
      : 'bg-white/5 text-white/30 cursor-not-allowed pointer-events-none'

    return (
      <a
        href={link?.link_url ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all ${colorClasses}`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{link?.text ?? fallback}</span>
      </a>
    )
  }

  return (
    <section
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-16 overflow-hidden"
      style={
        hero.background_image_url
          ? undefined
          : {
              background:
                'linear-gradient(180deg, hsl(280 30% 15%) 0%, hsl(280 20% 8%) 50%, hsl(0 0% 5%) 100%)',
            }
      }
    >
      {hero.background_image_url && (
        <Image
          src={hero.background_image_url}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={60}
          className="object-cover -z-10"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="ROOF! Produtora"
            width={400}
            height={120}
            className="h-16 md:h-24 lg:h-28 w-auto object-contain"
            priority
          />
        </div>

        <p className="text-white/90 text-lg md:text-xl mb-10">
          Valor e respeito ao Funk desde 2019!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-xl">
          {renderButton(btn1, 'light')}
          {renderButton(btn2, 'dark')}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mb-8">
          {renderLink(link1, Users, 'Faça parte do nosso time')}
          {renderLink(link2, CircleHelp, 'Outras dúvidas e suporte')}
          <a
            href={storeUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg transition-all ${
              storeUrl
                ? 'bg-white/10 text-white hover:bg-white/20 cursor-pointer backdrop-blur-sm'
                : 'bg-white/5 text-white/30 cursor-not-allowed pointer-events-none'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm">LOJA ROOF</span>
          </a>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.link_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors hover:scale-110"
                title={social.name}
              >
                <SocialIcon name={social.icon_name} size={24} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
