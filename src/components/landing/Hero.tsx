import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { HeroSection, HeroButton, HeroLink, FooterLink } from '@/types/database'

type Props = {
  hero: HeroSection
  buttons: HeroButton[]
  links: HeroLink[]
  socialLinks: FooterLink[]
}

export function Hero({ hero, buttons, links, socialLinks }: Props) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {hero.background_image_url && (
        <Image
          src={hero.background_image_url}
          alt="ROOF! Produtora"
          fill
          className="object-cover object-center"
          priority
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        {hero.logo_url && (
          <Image
            src={hero.logo_url}
            alt="ROOF! Produtora"
            width={480}
            height={140}
            className="mb-8 max-w-[80vw]"
            priority
          />
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          {buttons.map((btn) => (
            <a
              key={btn.id}
              href={btn.link_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80 ${
                btn.image_url
                  ? 'bg-white text-black'
                  : 'border-2 border-white bg-transparent text-white'
              }`}
            >
              {btn.image_url && (
                <Image
                  src={btn.image_url}
                  alt={btn.name}
                  width={80}
                  height={28}
                  className="object-contain h-7 w-auto"
                />
              )}
              <span>{btn.name}</span>
            </a>
          ))}
        </div>

        {/* Text Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.link_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/80 text-sm hover:text-white transition-colors"
            >
              {link.text}
              <ArrowRight size={14} />
            </a>
          ))}
        </div>
      </div>

      {/* Social Icons — bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-5">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.link_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors"
            aria-label={social.name}
          >
            <SocialIcon name={social.icon_name} size={18} />
          </a>
        ))}
      </div>
    </section>
  )
}
