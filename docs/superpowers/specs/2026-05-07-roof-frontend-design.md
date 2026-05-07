# ROOF! Produtora — Frontend Redesign Spec

**Data:** 2026-05-07  
**Stack:** Next.js 15 (App Router) + Supabase + Tailwind CSS  
**Repositório:** `C:\Users\Pichau\Desktop\Work\roof`  
**Objetivo:** Replicar pixel-perfect o site roofprodutora.com.br (código original perdido) com fix do egress problem do Supabase Storage.

---

## 1. Arquitetura

### Abordagem
Next.js 15 App Router, monorepo único contendo landing page e admin panel. Server Components buscam dados Supabase com ISR (`revalidate: 300`). URLs de storage construídas estaticamente — elimina chamadas `/object/info/`.

### Estrutura de Pastas

```
src/
  app/
    page.tsx                    # Landing (ISR revalidate: 300)
    layout.tsx
    globals.css
    admin/
      layout.tsx                # Auth guard — redirect /admin/login se sem sessão
      login/page.tsx
      page.tsx                  # Dashboard
      hero/page.tsx
      slider/page.tsx
      produtora/page.tsx
      videos/page.tsx
      botoes/page.tsx
      footer-links/page.tsx
      footer-settings/page.tsx
      users/page.tsx
  components/
    landing/
      Hero.tsx
      RedBanner.tsx
      PhotoSlider.tsx
      AboutSection.tsx
      StatsBanner.tsx
      ProdutoraSection.tsx
      VideoCarousel.tsx
      Footer.tsx
    admin/
      Sidebar.tsx
      DashboardCard.tsx
      ImageUploader.tsx
      SortableImageList.tsx
      VideoList.tsx
      ToggleRow.tsx
  lib/
    supabase/
      server.ts                 # createServerClient (@supabase/ssr)
      client.ts                 # createBrowserClient (@supabase/ssr)
    storage.ts                  # storageUrl() helper
  types/
    database.ts                 # tipos do schema Supabase
```

### Dependências

| Pacote | Uso |
|---|---|
| `next` v15 | Framework |
| `@supabase/ssr` | Auth + data server/client |
| `tailwindcss` | Estilos |
| `embla-carousel-react` | Slider fotos + carrossel vídeos |
| `lucide-react` | Ícones admin e footer |
| `@dnd-kit/core` | Drag-and-drop reorder (admin) |

---

## 2. Fix Egress — Regra Central

**Problema identificado:** Código original chamava `/object/info/` para cada imagem a cada page load (burst de ~10 requests/60s de múltiplos edge nodes).

**Fix:**
```ts
// lib/storage.ts
export const storageUrl = (bucket: string, path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
```

Regra: **nenhum componente chama `supabase.storage.getPublicUrl()`** — apenas `storageUrl()`. As URLs no banco já são URLs completas, portanto usar direto.

**Imagens com lazy loading:**
- Hero background + logo: `priority` (above fold)
- Todos os outros: `loading="lazy"` via `<Image>` do Next.js

**`next.config.ts`:**
```ts
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'ulaqqtsmfurfpmqpvvlq.supabase.co',
  }, {
    protocol: 'https',
    hostname: 'img.youtube.com',
  }]
}
```

---

## 3. Landing Page — Seções

Layout baseado em screenshots capturados em 2026-05-07. Replicação pixel-perfect obrigatória.

### Design Tokens

| Token | Valor |
|---|---|
| Cor primária (vermelho) | `#CC0000` |
| Background escuro | `#0a0a0a` |
| Background dark secundário | `#111111` |
| Texto | `#FFFFFF` |
| Font headings | Bebas Neue (Google Fonts) |
| Font corpo | Inter ou system-ui |

### Seção 1 — Hero
- Viewport height: `100vh`
- Background: `hero_section.background_image_url`, overlay `rgba(0,0,0,0.5)`
- Centro: logo `hero_section.logo_url` + subtítulo pequeno
- 2 botões (`hero_buttons` ordered by `display_order`):
  - Botão com `image_url`: exibe imagem + nome
  - Botão sem `image_url`: exibe nome + ícone PIX
  - Ambos retangulares, não arredondados
  - Click → `link_url`
- 2 links texto (`hero_links` ordered by `display_order`): ícone seta → `link_url`
- Rodapé do hero: ícones sociais (Instagram, Facebook, Twitter, Spotify, YouTube, TikTok) vindos de `footer_links`

### Seção 2 — Banner Vermelho
- Full width, fundo `#CC0000`
- Texto: `content_section_settings` onde `title = 'VEJA O QUE TE ESPERA NAS PRÓXIMAS EDIÇÕES'`
- Tipografia: Bebas Neue, grande, branco, centrado

### Seção 3 — Photo Slider
- Fundo `#111`
- Título + subtítulo do mesmo `content_section_settings`
- Embla Carousel: peek effect (imagens adjacentes parcialmente visíveis)
- Drag habilitado, dots de navegação
- Cada imagem: clicável → `slider_images.link_url`
- Imagens ordenadas por `display_order`

### Seção 4 — "ROOF! lidera uma revolução"
- Fundo branco
- "ROOF! lidera uma revolução." — mix tipográfico (ROOF! bold + "lidera uma revolução" italic/light)
- Subtítulo: "Transformamos a cena com experiências autênticas..."
- Texto centrado

### Seção 5 — Stats Banner
- Fundo `#CC0000`
- "+30 eventos realizados de forma independente"
- Bebas Neue, grande, branco, centrado

### Seção 6 — A Produtora
- Fundo `#0a0a0a`
- Layout: 2 colunas
  - Esquerda: "A PRODUTORA" logo/texto + parágrafo descritivo
  - Direita: grid 2×2 com `about_images` (4 fotos)
- Imagens ordenadas por `display_order`

### Seção 7 — Video Carousel
- Fundo `#111`
- Embla Carousel horizontal
- Cada card: thumbnail YouTube (`thumbnail_url`) + play icon overlay
- Click → abre `video_url` em nova aba
- Ordenado por `display_order`

### Seção 8 — Footer
- Fundo `#0a0a0a`
- Logo "ROOF! PRODUTORA"
- Contato: `footer_settings.email`, `footer_settings.phone`, `footer_settings.cnpj`
- Ícones sociais: `footer_links` (apenas `is_active = true`)
- Copyright text

---

## 4. Data Fetching — Landing

```ts
// app/page.tsx
export const revalidate = 300 // ISR: revalida a cada 5 minutos

async function getData() {
  const supabase = createServerClient()
  const [hero, buttons, links, sliderImages, contentSection,
         videos, aboutImages, footerSettings, footerLinks] = await Promise.all([
    supabase.from('hero_section').select('*').single(),
    supabase.from('hero_buttons').select('*').eq('is_active', true).order('display_order'),
    supabase.from('hero_links').select('*').eq('is_active', true).order('display_order'),
    supabase.from('slider_images').select('*').eq('is_active', true).order('display_order'),
    supabase.from('content_section_settings').select('*')
      .eq('title', 'VEJA O QUE TE ESPERA NAS PRÓXIMAS EDIÇÕES').single(),
    supabase.from('video_carousel').select('*').eq('is_active', true).order('display_order'),
    supabase.from('about_images').select('*').eq('is_active', true).order('display_order'),
    supabase.from('footer_settings').select('*').single(),
    supabase.from('footer_links').select('*').eq('is_active', true).order('display_order'),
  ])
  return { hero, buttons, links, sliderImages, contentSection,
           videos, aboutImages, footerSettings, footerLinks }
}
```

---

## 5. Admin Panel

### Auth
- Supabase Auth (email/password)
- `admin/layout.tsx`: Server Component verifica sessão → redirect `/admin/login` se não autenticado
- Role check: `user_roles.role = 'admin'`

### Design Admin
- Sidebar fixa, fundo `#1a1a1a`, 240px largura
- Logo "ROOF!" vermelho + "ADMIN" branco no topo
- Item ativo: highlight `#CC0000` background
- "Sair" no rodapé com ícone

### Páginas Admin

**Dashboard (`/admin`)**
- 4 cards: contagem de slider images, vídeos, botões, links
- "Status do Sistema": email + role do usuário logado

**Hero Section (`/admin/hero`)**
- Upload logo (bucket `hero-images`)
- Upload background image (bucket `hero-images`)
- Preview em tempo real

**Slider de Imagens (`/admin/slider`)**
- Editar título + subtítulo da seção (salva em `content_section_settings`)
- Lista de imagens com preview, reorder drag-and-drop, toggle ativo, delete
- Upload nova imagem + URL de link

**Seção Produtora (`/admin/produtora`)**
- Lista de 4 imagens about com reorder, toggle, delete
- Upload nova imagem

**Carrossel de Vídeos (`/admin/videos`)**
- Lista de vídeos: thumbnail + URL YouTube
- Add/edit/delete/toggle
- Reorder drag-and-drop

**Botões e Links (`/admin/botoes`)**
- Seção "Botões": editar nome, link_url, toggle ativo
- Seção "Links de Texto": editar texto, link_url, toggle ativo

**Links do Footer (`/admin/footer-links`)**
- Grid 2×3 com cards por rede social
- Cada card: ícone + nome + input URL + toggle ativo

**Config. Footer (`/admin/footer-settings`)**
- Inputs: telefone, email, CNPJ
- Botão salvar

**Usuários (`/admin/users`)**
- Tabela: nome/email, role badge, status, data criação
- Ações: toggle ativo, change role

---

## 6. Supabase — Projeto

- **Project ID:** `ulaqqtsmfurfpmqpvvlq`
- **Region:** `sa-east-1` (São Paulo)
- **Buckets:** `hero-images`, `slider-images`, `about-images`
- **Auth:** já configurado com 2 usuários admin

---

## 7. Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://ulaqqtsmfurfpmqpvvlq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

---

## 8. Deploy

Vercel (recomendado). Após deploy:
1. Configurar Cloudflare na frente do domínio (DNS only, sem tocar no código)
2. Cloudflare cacheia imagens → egress Supabase Storage cai drasticamente
