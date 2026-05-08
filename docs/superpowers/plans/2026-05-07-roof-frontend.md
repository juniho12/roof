# ROOF! Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir pixel-perfect o frontend de roofprodutora.com.br (landing page + admin CMS) em Next.js 15 + Supabase, com fix de egress via URLs diretas de storage e ISR.

**Architecture:** Next.js 15 App Router, monorepo único. Landing em `/` com Server Components + ISR (revalidate: 300). Admin em `/admin` com Supabase Auth guard. Nenhum componente chama `supabase.storage.getPublicUrl()` — URLs do banco usadas diretamente.

**Tech Stack:** Next.js 15, @supabase/ssr, Tailwind CSS, Embla Carousel, Lucide React, @dnd-kit/core

**Screenshots de referência:** `C:\Users\Pichau\Pictures\Screenshots\Captura de tela 2026-05-07 2040*.png` — consultar em cada componente para garantir pixel-perfect.

---

## Fase 1: Setup

---

### Task 1: Bootstrap projeto Next.js

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` (via create-next-app)

- [ ] **Step 1: Criar projeto**

No diretório `C:\Users\Pichau\Desktop\Work\roof`, rodar:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Responder às prompts: aceitar defaults (Yes para tudo exceto Turbopack — responder No).

- [ ] **Step 2: Instalar dependências adicionais**

```bash
npm install @supabase/ssr @supabase/supabase-js embla-carousel-react lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 3: Verificar instalação**

```bash
npm run dev
```

Esperado: servidor rodando em `http://localhost:3000` sem erros.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js 15 project with dependencies"
```

---

### Task 2: Configurar next.config, Tailwind e variáveis de ambiente

**Files:**
- Modify: `next.config.ts`
- Modify: `tailwind.config.ts`
- Create: `.env.local`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Atualizar `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ulaqqtsmfurfpmqpvvlq.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Atualizar `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        roof: {
          red: '#CC0000',
          dark: '#0a0a0a',
          darker: '#111111',
          sidebar: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Criar `.env.local`**

Pegar as keys em https://supabase.com/dashboard/project/ulaqqtsmfurfpmqpvvlq/settings/api

```env
NEXT_PUBLIC_SUPABASE_URL=https://ulaqqtsmfurfpmqpvvlq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<cole_aqui_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<cole_aqui_service_role_key>
```

- [ ] **Step 4: Atualizar `src/app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-bebas: 'Bebas Neue', sans-serif;
  --font-inter: 'Inter', system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: var(--font-inter);
}
```

- [ ] **Step 5: Verificar build**

```bash
npm run build
```

Esperado: build sem erros de config.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: configure next.config, tailwind tokens, env and global styles"
```

---

### Task 3: Types e Supabase lib

**Files:**
- Create: `src/types/database.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/storage.ts`

- [ ] **Step 1: Criar `src/types/database.ts`**

```ts
export type HeroSection = {
  id: string
  background_image_url: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export type HeroButton = {
  id: string
  hero_id: string | null
  name: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type HeroLink = {
  id: string
  hero_id: string | null
  name: string
  text: string
  link_url: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type SliderImage = {
  id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_active: boolean
  link_url: string | null
  created_at: string
  updated_at: string
}

export type VideoCarouselItem = {
  id: string
  title: string | null
  video_url: string
  thumbnail_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FooterLink = {
  id: string
  name: string
  icon_name: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FooterSettings = {
  id: string
  phone: string | null
  email: string | null
  cnpj: string | null
  created_at: string
  updated_at: string
}

export type AboutImage = {
  id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContentSectionSettings = {
  id: string
  title: string
  subtitle: string | null
  created_at: string
  updated_at: string
}

export type UserRole = {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at: string
}

export type Profile = {
  id: string
  user_id: string
  display_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
```

- [ ] **Step 2: Criar `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 3: Criar `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 4: Criar `src/lib/storage.ts`**

```ts
// Regra: NUNCA usar supabase.storage.getPublicUrl()
// URLs do banco já são completas — usar diretamente
// Este helper é para construir URL quando só temos o path
export const storageUrl = (bucket: string, path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add database types and Supabase lib clients"
```

---

## Fase 2: Landing Page

---

### Task 4: App layout e Social Icon helper

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/ui/SocialIcon.tsx`

- [ ] **Step 1: Atualizar `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ROOF! a produtora',
  description: 'Transformando eventos em experiências inesquecíveis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Criar `src/components/ui/SocialIcon.tsx`**

Mapeia `icon_name` do banco (instagram, facebook, twitter, spotify, youtube, tiktok) para ícones/SVGs.

```tsx
import { Instagram, Facebook, Twitter, Youtube, Music } from 'lucide-react'

type Props = {
  name: string
  size?: number
  className?: string
}

function TikTokIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.76a4.85 4.85 0 01-1.02-.07z" />
    </svg>
  )
}

export function SocialIcon({ name, size = 20, className }: Props) {
  const props = { size, className }
  switch (name.toLowerCase()) {
    case 'instagram': return <Instagram {...props} />
    case 'facebook': return <Facebook {...props} />
    case 'twitter': return <Twitter {...props} />
    case 'youtube': return <Youtube {...props} />
    case 'spotify': return <Music {...props} />
    case 'tiktok': return <TikTokIcon size={size} className={className} />
    default: return null
  }
}
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: app layout and SocialIcon component"
```

---

### Task 5: Componente Hero

**Files:**
- Create: `src/components/landing/Hero.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204030.png`
- Fullscreen dark overlay sobre foto de show
- Logo centralizado
- 2 botões retangulares (Blacktag branco + PIX escuro)
- 2 links texto com seta
- Ícones sociais na base

- [ ] **Step 1: Criar `src/components/landing/Hero.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Hero landing component"
```

---

### Task 6: Red Banner + Photo Slider

**Files:**
- Create: `src/components/landing/RedBanner.tsx`
- Create: `src/components/landing/PhotoSlider.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204037.png`
- Banner vermelho full-width com título Bebas Neue
- Slider com peek effect (imagens adjacentes parcialmente visíveis), dots

- [ ] **Step 1: Criar `src/components/landing/RedBanner.tsx`**

```tsx
type Props = {
  title: string
}

export function RedBanner({ title }: Props) {
  return (
    <div className="w-full bg-roof-red py-6 px-4">
      <p className="font-bebas text-center text-white text-4xl md:text-5xl tracking-wide leading-tight">
        {title}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/components/landing/PhotoSlider.tsx`**

```tsx
'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { SliderImage, ContentSectionSettings } from '@/types/database'

type Props = {
  images: SliderImage[]
  section: ContentSectionSettings
}

export function PhotoSlider({ images, section }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: 'start',
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  return (
    <section className="bg-roof-darker py-16">
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <h2 className="font-bebas text-white text-4xl md:text-5xl mb-2">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-white/60 text-sm">{section.subtitle}</p>
        )}
      </div>

      <div className="overflow-hidden px-6" ref={emblaRef}>
        <div className="flex gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_42%] lg:flex-[0_0_32%]"
            >
              <a
                href={img.link_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? 'ROOF! evento'}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover"
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === selectedIndex ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: RedBanner and PhotoSlider components"
```

---

### Task 7: About Section + Stats Banner

**Files:**
- Create: `src/components/landing/AboutSection.tsx`
- Create: `src/components/landing/StatsBanner.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204037.png` (seção branca) e `204052.png` (banner vermelho)
- Seção branca: "ROOF! lidera uma revolução." — ROOF! bold + restante italic
- Banner vermelho: "+30 eventos realizados de forma independente"

- [ ] **Step 1: Criar `src/components/landing/AboutSection.tsx`**

```tsx
export function AboutSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
          <span className="font-black">ROOF!</span>{' '}
          <em className="font-light not-italic" style={{ fontStyle: 'italic' }}>
            lidera uma revolução.
          </em>
        </h2>
        <p className="text-gray-600 text-base leading-relaxed">
          Transformamos a cena com experiências autênticas, qualidade sonora e
          acessível 100% open bar para amantes do funk!
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar `src/components/landing/StatsBanner.tsx`**

```tsx
export function StatsBanner() {
  return (
    <div className="w-full bg-roof-red py-6 px-4">
      <p className="font-bebas text-center text-white text-4xl md:text-5xl tracking-wide">
        +30 eventos realizados de forma independente
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: AboutSection and StatsBanner components"
```

---

### Task 8: Seção A Produtora

**Files:**
- Create: `src/components/landing/ProdutoraSection.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204052.png` e `204058.png`
- Fundo `#0a0a0a`
- Layout 2 colunas: texto esquerda, grid 2×2 de fotos direita
- "A PRODUTORA" em destaque

- [ ] **Step 1: Criar `src/components/landing/ProdutoraSection.tsx`**

```tsx
import Image from 'next/image'
import type { AboutImage } from '@/types/database'

type Props = {
  images: AboutImage[]
}

export function ProdutoraSection({ images }: Props) {
  return (
    <section className="bg-roof-dark py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div>
          <p className="font-bebas text-white text-5xl md:text-6xl mb-6 tracking-wide">
            A PRODUTORA
          </p>
          <p className="text-white/70 text-base leading-relaxed">
            A ROOF! nasceu em 2019 e hoje é referência em eventos de funk open bar em
            SP, com labels como: Baile da ROOF!, Subverso e Collabs com artistas da cena.
          </p>
        </div>

        {/* Right: 2×2 grid */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 4).map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden">
              <Image
                src={img.image_url}
                alt={img.alt_text ?? 'ROOF! Produtora'}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: ProdutoraSection component"
```

---

### Task 9: Video Carousel

**Files:**
- Create: `src/components/landing/VideoCarousel.tsx`

**Referência:** Videos da tabela `video_carousel` com thumbnails YouTube. Click → abre em nova aba.

- [ ] **Step 1: Criar `src/components/landing/VideoCarousel.tsx`**

```tsx
'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

type Props = {
  videos: VideoCarouselItem[]
}

export function VideoCarousel({ videos }: Props) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: 'start',
    dragFree: true,
  })

  return (
    <section className="bg-roof-darker py-16">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <h2 className="font-bebas text-white text-4xl md:text-5xl">
          VOCÊ NO ROLE DA ROOF!
        </h2>
      </div>

      <div className="overflow-hidden px-6" ref={emblaRef}>
        <div className="flex gap-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative flex-[0_0_85%] sm:flex-[0_0_55%] md:flex-[0_0_40%] lg:flex-[0_0_30%] cursor-pointer group"
            >
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
              >
                {video.thumbnail_url && (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title ?? 'ROOF! Produtora video'}
                    width={480}
                    height={270}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                  <div className="bg-roof-red rounded-full p-4">
                    <Play size={24} className="text-white fill-white" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: VideoCarousel component"
```

---

### Task 10: Footer

**Files:**
- Create: `src/components/landing/Footer.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204058.png`
- Fundo `#0a0a0a`
- Logo ROOF! PRODUTORA
- Email, CNPJ
- Ícones sociais
- Copyright

- [ ] **Step 1: Criar `src/components/landing/Footer.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: Footer component"
```

---

### Task 11: Landing Page — wiring completo

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Substituir `src/app/page.tsx` com data fetching + composição**

```tsx
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/landing/Hero'
import { RedBanner } from '@/components/landing/RedBanner'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { AboutSection } from '@/components/landing/AboutSection'
import { StatsBanner } from '@/components/landing/StatsBanner'
import { ProdutoraSection } from '@/components/landing/ProdutoraSection'
import { VideoCarousel } from '@/components/landing/VideoCarousel'
import { Footer } from '@/components/landing/Footer'

export const revalidate = 300

async function getData() {
  const supabase = await createClient()

  const [
    { data: hero },
    { data: buttons },
    { data: links },
    { data: sliderImages },
    { data: contentSection },
    { data: videos },
    { data: aboutImages },
    { data: footerSettings },
    { data: footerLinks },
  ] = await Promise.all([
    supabase.from('hero_section').select('*').single(),
    supabase.from('hero_buttons').select('*').eq('is_active', true).order('display_order'),
    supabase.from('hero_links').select('*').eq('is_active', true).order('display_order'),
    supabase.from('slider_images').select('*').eq('is_active', true).order('display_order'),
    supabase
      .from('content_section_settings')
      .select('*')
      .eq('title', 'VEJA O QUE TE ESPERA NAS PRÓXIMAS EDIÇÕES')
      .single(),
    supabase.from('video_carousel').select('*').eq('is_active', true).order('display_order'),
    supabase.from('about_images').select('*').eq('is_active', true).order('display_order'),
    supabase.from('footer_settings').select('*').single(),
    supabase.from('footer_links').select('*').eq('is_active', true).order('display_order'),
  ])

  return {
    hero,
    buttons: buttons ?? [],
    links: links ?? [],
    sliderImages: sliderImages ?? [],
    contentSection,
    videos: videos ?? [],
    aboutImages: aboutImages ?? [],
    footerSettings,
    footerLinks: footerLinks ?? [],
  }
}

export default async function HomePage() {
  const data = await getData()

  if (!data.hero || !data.footerSettings) {
    return <div className="text-white p-8">Erro ao carregar dados.</div>
  }

  return (
    <main>
      <Hero
        hero={data.hero}
        buttons={data.buttons}
        links={data.links}
        socialLinks={data.footerLinks}
      />
      {data.contentSection && (
        <>
          <RedBanner title={data.contentSection.title} />
          <PhotoSlider images={data.sliderImages} section={data.contentSection} />
        </>
      )}
      <AboutSection />
      <StatsBanner />
      <ProdutoraSection images={data.aboutImages} />
      <VideoCarousel videos={data.videos} />
      <Footer settings={data.footerSettings} links={data.footerLinks} />
    </main>
  )
}
```

- [ ] **Step 2: Testar landing**

```bash
npm run dev
```

Abrir `http://localhost:3000` e comparar com os screenshots:
- `204030.png` → hero
- `204037.png` → banner + slider + about branco
- `204052.png` → stats banner + produtora
- `204058.png` → footer

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete landing page with data fetching and all sections"
```

---

## Fase 3: Admin Panel

---

### Task 12: Admin Auth — Layout + Login

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/components/admin/Sidebar.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204118.png`
- Sidebar dark `#1a1a1a`, 240px
- Logo "ROOF!" vermelho + "ADMIN" branco
- Item ativo com background `#CC0000`
- "Sair" no rodapé

- [ ] **Step 1: Criar `src/app/admin/login/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-roof-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-bebas text-4xl">
            <span className="text-roof-red">ROOF!</span>
            <span className="text-white"> ADMIN</span>
          </span>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-roof-sidebar text-white px-4 py-3 outline-none border border-white/10 focus:border-roof-red transition-colors"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-roof-sidebar text-white px-4 py-3 outline-none border border-white/10 focus:border-roof-red transition-colors"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-roof-red text-white py-3 font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/components/admin/Sidebar.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
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
  { href: '/admin/hero', label: 'Hero Section', icon: Image },
  { href: '/admin/slider', label: 'Slider de Imagens', icon: SlidersHorizontal },
  { href: '/admin/produtora', label: 'Seção Produtora', icon: Image },
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
```

- [ ] **Step 3: Criar `src/app/admin/layout.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-roof-dark">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Testar auth**

```bash
npm run dev
```

Navegar para `http://localhost:3000/admin` — deve redirecionar para `/admin/login`. Fazer login com credenciais do Supabase — deve ir para `/admin`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: admin auth layout, login page and sidebar"
```

---

### Task 13: Admin Dashboard + helpers compartilhados

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/DashboardCard.tsx`
- Create: `src/components/admin/PageHeader.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204118.png`
- 4 cards de contagem (Imagens slider, Vídeos, Botões, Links)
- Status do Sistema: email + role

- [ ] **Step 1: Criar `src/components/admin/DashboardCard.tsx`**

```tsx
import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  count: number
  icon: LucideIcon
  color?: string
}

export function DashboardCard({ label, count, icon: Icon, color = '#CC0000' }: Props) {
  return (
    <div className="bg-roof-sidebar border border-white/10 p-6 flex items-center justify-between">
      <div>
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-white text-3xl font-bold">{count}</p>
      </div>
      <Icon size={28} style={{ color }} />
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/components/admin/PageHeader.tsx`**

```tsx
type Props = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h1 className="font-bebas text-white text-4xl tracking-wide">{title}</h1>
      {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Criar `src/app/admin/page.tsx`**

```tsx
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
    { data: { user } },
  ] = await Promise.all([
    supabase.from('slider_images').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('video_carousel').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('hero_buttons').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('hero_links').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.auth.getUser(),
  ])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo, ${user?.email}`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard label="Imagens no Slider" count={sliderCount ?? 0} icon={SlidersHorizontal} />
        <DashboardCard label="Vídeos no Carrossel" count={videosCount ?? 0} icon={Film} color="#f97316" />
        <DashboardCard label="Botões" count={buttonsCount ?? 0} icon={Link2} color="#22c55e" />
        <DashboardCard label="Links" count={linksCount ?? 0} icon={Share2} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="font-bebas text-white text-2xl mb-4">Status do Sistema</h2>
          <p className="text-white/50 text-sm mb-3">Informações sobre sua conta</p>
          <div className="flex items-center justify-between border-t border-white/10 py-3">
            <span className="text-white/50 text-sm">E-mail</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 py-3">
            <span className="text-white/50 text-sm">Nível de Acesso</span>
            <span className="text-roof-red font-bold text-sm">Administrador</span>
          </div>
        </div>

        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="font-bebas text-white text-2xl mb-4">Ações Rápidas</h2>
          <p className="text-white/50 text-sm">
            Use o menu lateral para acessar as diferentes seções de gerenciamento de conteúdo.
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verificar**

```bash
npm run dev
```

Navegar para `http://localhost:3000/admin` — dashboard deve mostrar contagens reais do Supabase.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: admin dashboard with live counts"
```

---

### Task 14: Admin — Hero Section

**Files:**
- Create: `src/components/admin/ImageUploader.tsx`
- Create: `src/app/admin/hero/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204123.png`
- Upload logo + background com preview
- Botão "Carregar Nova Imagem/Logo"

- [ ] **Step 1: Criar `src/components/admin/ImageUploader.tsx`**

```tsx
'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  label: string
  currentUrl: string | null
  bucket: string
  onUploaded: (url: string) => void
}

export function ImageUploader({ label, currentUrl, bucket, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const filename = `${label.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.${file.name.split('.').pop()}`

    const { error } = await supabase.storage.from(bucket).upload(filename, file, {
      upsert: true,
    })

    if (error) {
      alert(`Erro ao fazer upload: ${error.message}`)
      setUploading(false)
      return
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
    setPreview(url)
    onUploaded(url)
    setUploading(false)
  }

  return (
    <div className="mb-8">
      <p className="text-white font-bold mb-3">{label}</p>
      {preview && (
        <div className="mb-4 relative h-40 w-auto inline-block">
          <Image
            src={preview}
            alt={label}
            width={320}
            height={160}
            className="h-40 w-auto object-contain bg-black/30 border border-white/10"
          />
        </div>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? 'Enviando...' : `Carregar Nova ${label}`}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/app/admin/hero/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PageHeader } from '@/components/admin/PageHeader'
import type { HeroSection } from '@/types/database'

export default function HeroPage() {
  const [hero, setHero] = useState<HeroSection | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('hero_section').select('*').single().then(({ data }) => {
      if (data) setHero(data)
    })
  }, [])

  async function updateField(field: 'logo_url' | 'background_image_url', url: string) {
    if (!hero) return
    await supabase
      .from('hero_section')
      .update({ [field]: url, updated_at: new Date().toISOString() })
      .eq('id', hero.id)
    setHero((prev) => prev ? { ...prev, [field]: url } : prev)
  }

  if (!hero) {
    return <div className="text-white/50">Carregando...</div>
  }

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Gerencie o conteúdo da seção principal da Landing Page"
      />
      <div className="bg-roof-sidebar border border-white/10 p-6 max-w-2xl">
        <ImageUploader
          label="Logo"
          currentUrl={hero.logo_url}
          bucket="hero-images"
          onUploaded={(url) => updateField('logo_url', url)}
        />
        <ImageUploader
          label="Imagem de Fundo"
          currentUrl={hero.background_image_url}
          bucket="hero-images"
          onUploaded={(url) => updateField('background_image_url', url)}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: admin hero section with image upload"
```

---

### Task 15: Admin — Slider de Imagens

**Files:**
- Create: `src/components/admin/SortableImageList.tsx`
- Create: `src/app/admin/slider/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204130.png`
- Editar título + subtítulo da seção
- Lista de imagens com preview, toggle ativo, delete
- Upload nova imagem + campo de link

- [ ] **Step 1: Criar `src/components/admin/SortableImageList.tsx`**

```tsx
'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

type ImageItem = {
  id: string
  image_url: string
  alt_text?: string | null
  link_url?: string | null
  is_active: boolean
  display_order: number
}

type Props = {
  items: ImageItem[]
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onLinkChange?: (id: string, url: string) => void
  showLinkField?: boolean
}

export function SortableImageList({ items, onToggle, onDelete, onLinkChange, showLinkField }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-roof-sidebar border border-white/10 p-3"
        >
          <Image
            src={item.image_url}
            alt={item.alt_text ?? ''}
            width={80}
            height={56}
            className="object-cover h-14 w-20 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {showLinkField && onLinkChange && (
              <input
                type="url"
                defaultValue={item.link_url ?? ''}
                placeholder="URL de destino"
                onBlur={(e) => onLinkChange(item.id, e.target.value)}
                className="w-full bg-transparent text-white/70 text-xs border-b border-white/10 focus:border-roof-red outline-none py-1 mb-1"
              />
            )}
            <p className="text-white/40 text-xs truncate">{item.image_url.split('/').pop()}</p>
          </div>
          <label className="flex items-center gap-1 cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={item.is_active}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              className="accent-roof-red"
            />
            <span className="text-white/60 text-xs">Ativo</span>
          </label>
          <button
            onClick={() => onDelete(item.id)}
            className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/app/admin/slider/page.tsx`**

```tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SortableImageList } from '@/components/admin/SortableImageList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus, Save } from 'lucide-react'
import type { SliderImage, ContentSectionSettings } from '@/types/database'

export default function SliderPage() {
  const [images, setImages] = useState<SliderImage[]>([])
  const [section, setSection] = useState<ContentSectionSettings | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('slider_images').select('*').eq('is_active', true).order('display_order'),
      supabase.from('content_section_settings')
        .select('*')
        .eq('title', 'VEJA O QUE TE ESPERA NAS PRÓXIMAS EDIÇÕES')
        .single(),
    ]).then(([{ data: imgs }, { data: sec }]) => {
      setImages(imgs ?? [])
      if (sec) {
        setSection(sec)
        setTitle(sec.title)
        setSubtitle(sec.subtitle ?? '')
      }
    })
  }, [])

  async function saveText() {
    if (!section) return
    await supabase
      .from('content_section_settings')
      .update({ title, subtitle, updated_at: new Date().toISOString() })
      .eq('id', section.id)
    alert('Textos salvos!')
  }

  async function toggleImage(id: string, active: boolean) {
    await supabase.from('slider_images').update({ is_active: active }).eq('id', id)
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, is_active: active } : img))
  }

  async function deleteImage(id: string) {
    if (!confirm('Deletar imagem?')) return
    await supabase.from('slider_images').delete().eq('id', id)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function updateLink(id: string, url: string) {
    await supabase.from('slider_images').update({ link_url: url }).eq('id', id)
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `slider-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('slider-images').upload(filename, file)
    if (error) { alert(error.message); setUploading(false); return }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slider-images/${filename}`
    const maxOrder = Math.max(0, ...images.map((i) => i.display_order))
    const { data } = await supabase
      .from('slider_images')
      .insert({ image_url: url, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setImages((prev) => [...prev, data])
    setUploading(false)
  }

  return (
    <div>
      <PageHeader
        title="Slider de Imagens"
        description="Gerencie a imagens e textos do slider"
      />

      <div className="bg-roof-sidebar border border-white/10 p-6 mb-6 max-w-2xl">
        <h2 className="text-white font-bold mb-4">Textos da Seção</h2>
        <div className="flex flex-col gap-3 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtítulo"
            className="bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
        </div>
        <button
          onClick={saveText}
          className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors"
        >
          <Save size={14} />
          Salvar Textos
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Imagens</h2>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus size={14} />
              {uploading ? 'Enviando...' : 'Adicionar Imagem'}
            </button>
          </div>
        </div>
        <SortableImageList
          items={images}
          onToggle={toggleImage}
          onDelete={deleteImage}
          onLinkChange={updateLink}
          showLinkField
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: admin slider images page with upload and CRUD"
```

---

### Task 16: Admin — Seção Produtora

**Files:**
- Create: `src/app/admin/produtora/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204136.png`
- Upload + lista de 4 imagens about

- [ ] **Step 1: Criar `src/app/admin/produtora/page.tsx`**

```tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SortableImageList } from '@/components/admin/SortableImageList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus } from 'lucide-react'
import type { AboutImage } from '@/types/database'

export default function ProdutoraAdminPage() {
  const [images, setImages] = useState<AboutImage[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('about_images').select('*').order('display_order').then(({ data }) => {
      setImages(data ?? [])
    })
  }, [])

  async function toggleImage(id: string, active: boolean) {
    await supabase.from('about_images').update({ is_active: active }).eq('id', id)
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, is_active: active } : img))
  }

  async function deleteImage(id: string) {
    if (!confirm('Deletar imagem?')) return
    await supabase.from('about_images').delete().eq('id', id)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('about-images').upload(filename, file)
    if (error) { alert(error.message); setUploading(false); return }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/about-images/${filename}`
    const maxOrder = Math.max(0, ...images.map((i) => i.display_order))
    const { data } = await supabase
      .from('about_images')
      .insert({ image_url: url, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setImages((prev) => [...prev, data])
    setUploading(false)
  }

  return (
    <div>
      <PageHeader
        title="Seção A Produtora"
        description="Gerencie a seção A Produtora na landing page"
      />
      <div className="max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold">Imagens ({images.length})</h2>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus size={14} />
              {uploading ? 'Enviando...' : 'Adicionar Imagem'}
            </button>
          </div>
        </div>
        <SortableImageList items={images} onToggle={toggleImage} onDelete={deleteImage} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: admin produtora section"
```

---

### Task 17: Admin — Carrossel de Vídeos

**Files:**
- Create: `src/components/admin/VideoList.tsx`
- Create: `src/app/admin/videos/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204141.png`
- Lista de vídeos com thumbnail + URL + toggle + delete
- Adicionar novo vídeo

- [ ] **Step 1: Criar `src/components/admin/VideoList.tsx`**

```tsx
'use client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

type Props = {
  items: VideoCarouselItem[]
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function VideoList({ items, onToggle, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-roof-sidebar border border-white/10 p-3"
        >
          {item.thumbnail_url && (
            <Image
              src={item.thumbnail_url}
              alt={item.title ?? 'video'}
              width={90}
              height={56}
              className="object-cover h-14 w-24 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs truncate">{item.video_url}</p>
            {item.title && <p className="text-white/40 text-xs mt-1">{item.title}</p>}
          </div>
          <label className="flex items-center gap-1 cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={item.is_active}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              className="accent-roof-red"
            />
            <span className="text-white/60 text-xs">Ativo</span>
          </label>
          <button
            onClick={() => onDelete(item.id)}
            className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/app/admin/videos/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VideoList } from '@/components/admin/VideoList'
import { PageHeader } from '@/components/admin/PageHeader'
import { Plus } from 'lucide-react'
import type { VideoCarouselItem } from '@/types/database'

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoCarouselItem[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('video_carousel').select('*').order('display_order').then(({ data }) => {
      setVideos(data ?? [])
    })
  }, [])

  async function addVideo() {
    if (!newUrl.trim()) return
    setAdding(true)
    const videoId = getYouTubeId(newUrl)
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
    const maxOrder = Math.max(0, ...videos.map((v) => v.display_order))
    const { data } = await supabase
      .from('video_carousel')
      .insert({ video_url: newUrl, thumbnail_url: thumbnail, display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (data) setVideos((prev) => [...prev, data])
    setNewUrl('')
    setAdding(false)
  }

  async function toggleVideo(id: string, active: boolean) {
    await supabase.from('video_carousel').update({ is_active: active }).eq('id', id)
    setVideos((prev) => prev.map((v) => v.id === id ? { ...v, is_active: active } : v))
  }

  async function deleteVideo(id: string) {
    if (!confirm('Deletar vídeo?')) return
    await supabase.from('video_carousel').delete().eq('id', id)
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Carrossel de Vídeos"
        description="Gerencie os vídeos do YouTube na landing page"
      />

      <div className="bg-roof-sidebar border border-white/10 p-6 mb-6 max-w-2xl">
        <h2 className="text-white font-bold mb-3">Adicionar Vídeo</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL do YouTube (youtu.be/... ou youtube.com/watch?v=...)"
            className="flex-1 bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
          <button
            onClick={addVideo}
            disabled={adding || !newUrl}
            className="flex items-center gap-2 bg-roof-red text-white px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-white font-bold mb-4">Vídeos</h2>
        <VideoList items={videos} onToggle={toggleVideo} onDelete={deleteVideo} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: admin video carousel management"
```

---

### Task 18: Admin — Botões e Links

**Files:**
- Create: `src/components/admin/ToggleRow.tsx`
- Create: `src/app/admin/botoes/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204145.png`

- [ ] **Step 1: Criar `src/components/admin/ToggleRow.tsx`**

```tsx
type Props = {
  label: string
  value: string
  placeholder?: string
  active: boolean
  onChange: (value: string) => void
  onToggle: (active: boolean) => void
}

export function ToggleRow({ label, value, placeholder, active, onChange, onToggle }: Props) {
  return (
    <div className="border-b border-white/10 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">{label}</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-white/50 text-xs">{active ? 'Ativo' : 'Inativo'}</span>
          <div
            onClick={() => onToggle(!active)}
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-roof-red' : 'bg-white/20'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </label>
      </div>
      <input
        type="url"
        value={value}
        placeholder={placeholder ?? 'URL'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-roof-dark text-white/70 text-xs px-3 py-2 border border-white/10 outline-none focus:border-roof-red"
      />
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/app/admin/botoes/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ToggleRow } from '@/components/admin/ToggleRow'
import { PageHeader } from '@/components/admin/PageHeader'
import type { HeroButton, HeroLink } from '@/types/database'

export default function BotoesPage() {
  const [buttons, setButtons] = useState<HeroButton[]>([])
  const [links, setLinks] = useState<HeroLink[]>([])
  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('hero_buttons').select('*').order('display_order'),
      supabase.from('hero_links').select('*').order('display_order'),
    ]).then(([{ data: btns }, { data: lnks }]) => {
      setButtons(btns ?? [])
      setLinks(lnks ?? [])
    })
  }, [])

  async function updateButton(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('hero_buttons').update({ [field]: value }).eq('id', id)
    setButtons((prev) => prev.map((b) => b.id === id ? { ...b, [field]: value } : b))
  }

  async function updateLink(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('hero_links').update({ [field]: value }).eq('id', id)
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  return (
    <div>
      <PageHeader
        title="Botões e Links"
        description="Gerencie as URLs e status de todos os botões e links"
      />

      <div className="max-w-2xl space-y-8">
        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="text-white font-bold mb-2">Botões</h2>
          <p className="text-white/40 text-xs mb-4">Botões com imagem que aparecem na LP</p>
          {buttons.map((btn) => (
            <ToggleRow
              key={btn.id}
              label={btn.name}
              value={btn.link_url ?? ''}
              placeholder="URL de destino"
              active={btn.is_active}
              onChange={(url) => updateButton(btn.id, 'link_url', url)}
              onToggle={(active) => updateButton(btn.id, 'is_active', active)}
            />
          ))}
        </div>

        <div className="bg-roof-sidebar border border-white/10 p-6">
          <h2 className="text-white font-bold mb-2">Links de Texto</h2>
          <p className="text-white/40 text-xs mb-4">Links que aparecem na LP</p>
          {links.map((link) => (
            <ToggleRow
              key={link.id}
              label={link.text}
              value={link.link_url ?? ''}
              placeholder="URL de destino"
              active={link.is_active}
              onChange={(url) => updateLink(link.id, 'link_url', url)}
              onToggle={(active) => updateLink(link.id, 'is_active', active)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: admin botoes e links page"
```

---

### Task 19: Admin — Links do Footer

**Files:**
- Create: `src/app/admin/footer-links/page.tsx`

**Referência visual:** `Captura de tela 2026-05-07 204149.png`
- Grid 2×3 de cards por rede social: ícone + nome + URL + toggle

- [ ] **Step 1: Criar `src/app/admin/footer-links/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { PageHeader } from '@/components/admin/PageHeader'
import type { FooterLink } from '@/types/database'

export default function FooterLinksPage() {
  const [links, setLinks] = useState<FooterLink[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('footer_links').select('*').order('display_order').then(({ data }) => {
      setLinks(data ?? [])
    })
  }, [])

  async function updateLink(id: string, field: 'link_url' | 'is_active', value: string | boolean) {
    await supabase.from('footer_links').update({ [field]: value }).eq('id', id)
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, [field]: value } : l))
  }

  return (
    <div>
      <PageHeader
        title="Links do Footer"
        description="Gerencie as redes sociais do rodapé. Links sem URL não serão exibidos."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {links.map((link) => (
          <div key={link.id} className="bg-roof-sidebar border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SocialIcon name={link.icon_name} size={20} className="text-roof-red" />
                <span className="text-white font-bold text-sm">{link.name}</span>
              </div>
              <label className="flex items-center gap-1 cursor-pointer">
                <span className="text-white/40 text-xs">{link.is_active ? 'Ativo' : 'Inativo'}</span>
                <div
                  onClick={() => updateLink(link.id, 'is_active', !link.is_active)}
                  className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${link.is_active ? 'bg-roof-red' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${link.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
            <p className="text-white/40 text-xs mb-1">URL do link</p>
            <input
              type="url"
              defaultValue={link.link_url ?? ''}
              onBlur={(e) => updateLink(link.id, 'link_url', e.target.value)}
              className="w-full bg-roof-dark text-white/70 text-xs px-2 py-2 border border-white/10 outline-none focus:border-roof-red"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: admin footer links page"
```

---

### Task 20: Admin — Config. Footer + Usuários

**Files:**
- Create: `src/app/admin/footer-settings/page.tsx`
- Create: `src/app/admin/users/page.tsx`

**Referência visual:** `204156.png` (footer settings), `204200.png` (users)

- [ ] **Step 1: Criar `src/app/admin/footer-settings/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/admin/PageHeader'
import { Save } from 'lucide-react'
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
      <PageHeader
        title="Configurações do Footer"
        description="Gerencie as informações de contato exibidas no rodapé"
      />

      <div className="bg-roof-sidebar border border-white/10 p-6 max-w-xl">
        <h2 className="text-white font-bold mb-6">Informações de Contato</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-white/50 text-xs mb-1 block">Telefone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-white/50 text-xs mb-1 block">CNPJ</label>
          <input
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="w-full bg-roof-dark text-white px-3 py-2 border border-white/10 outline-none focus:border-roof-red text-sm"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-roof-red text-white px-6 py-3 font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `src/lib/supabase/admin.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

- [ ] **Step 3: Criar `src/app/admin/users/page.tsx`**

```tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'

export default async function UsersPage() {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: roles } = await supabase
    .from('user_roles')
    .select('*, profiles(display_name, is_active, user_id)')
    .order('created_at')

  const { data: { users } } = await adminSupabase.auth.admin.listUsers()

  const usersWithRoles = (roles ?? []).map((role) => {
    const authUser = users?.find((u) => u.id === role.user_id)
    return { ...role, email: authUser?.email ?? 'N/A' }
  })

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Usuários"
        description="Gerencie os usuários do sistema, suas permissões e status de acesso."
      />

      <div className="bg-roof-sidebar border border-white/10 max-w-4xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold">Usuários</h2>
            <p className="text-white/40 text-xs mt-1">Gerencie os usuários do sistema</p>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/40 text-xs px-6 py-3">Usuário</th>
              <th className="text-left text-white/40 text-xs px-6 py-3">Role</th>
              <th className="text-left text-white/40 text-xs px-6 py-3">Status</th>
              <th className="text-left text-white/40 text-xs px-6 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usersWithRoles.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="px-6 py-4 text-white text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-roof-red text-white text-xs px-2 py-1 font-bold uppercase">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 font-bold uppercase">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 text-xs">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: admin footer settings and users pages"
```

---

### Task 21: Build final e verificação

**Files:**
- Nenhum novo arquivo

- [ ] **Step 1: TypeScript check completo**

```bash
npx tsc --noEmit
```

Esperado: zero erros. Se houver erros, corrigi-los antes de prosseguir.

- [ ] **Step 2: Build de produção**

```bash
npm run build
```

Esperado: build sem erros. Verificar que ISR está configurado (deve aparecer "○ /  (ISR)" no output).

- [ ] **Step 3: Teste manual completo da landing**

```bash
npm run start
```

Abrir `http://localhost:3000` e verificar cada seção contra os screenshots:

| Screenshot | Seção a verificar |
|---|---|
| `204030.png` | Hero: logo, botões, links, ícones sociais |
| `204037.png` | Banner vermelho, slider fotos, seção branca |
| `204052.png` | Stats banner, A Produtora |
| `204058.png` | Footer |

- [ ] **Step 4: Teste manual completo do admin**

Abrir `http://localhost:3000/admin`:

- [ ] Login funciona
- [ ] Dashboard mostra contagens corretas
- [ ] Hero section: upload de imagem funciona
- [ ] Slider: upload + toggle + delete funcionam
- [ ] Vídeos: add URL YouTube, thumbnail gerada automaticamente
- [ ] Botões e Links: editar URL + toggle
- [ ] Footer Links: editar URL + toggle por rede social
- [ ] Config Footer: salvar telefone/email/CNPJ
- [ ] Usuários: lista correta

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: complete ROOF! frontend — landing page + admin panel"
```

---

## Notas de Implementação

### Egress — regra absoluta
Nenhum arquivo pode chamar `supabase.storage.getPublicUrl()` ou `supabase.storage.from().getPublicUrl()`. As URLs já vêm completas do banco. O `storageUrl()` de `lib/storage.ts` é apenas para uploads novos (construir URL após upload).

### Pixel-perfect
Screenshots disponíveis em `C:\Users\Pichau\Pictures\Screenshots\Captura de tela 2026-05-07 2040*.png`. Consultar durante cada componente de landing.

### RLS do Supabase
Admin pages fazem mutações via browser client com `anon_key`. Garantir que as RLS policies do Supabase permitem INSERT/UPDATE/DELETE para usuários autenticados com role `admin`. Verificar em https://supabase.com/dashboard/project/ulaqqtsmfurfpmqpvvlq/editor — se mutações falharem silenciosamente, verificar as policies primeiro.

### `auth.admin.listUsers()` — Task 20
Esta chamada requer `service_role_key`. Em `users/page.tsx` (Server Component), o client precisa ser criado com service role. Criar `src/lib/supabase/admin.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

E usar `createAdminClient()` em vez de `createClient()` no `users/page.tsx`.
