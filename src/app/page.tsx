import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/landing/Hero'
import { PhotoSlider } from '@/components/landing/PhotoSlider'
import { AboutSection } from '@/components/landing/AboutSection'
import { StatsBanner } from '@/components/landing/StatsBanner'
import { ProdutoraSection } from '@/components/landing/ProdutoraSection'
import { StoreSection } from '@/components/landing/StoreSection'
import { Footer } from '@/components/landing/Footer'
import { LazyMount } from '@/components/ui/LazyMount'

export const revalidate = 3600

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
    { data: storeSettings },
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
    supabase.from('store_settings').select('*').single(),
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
    storeSettings,
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
        storeUrl={data.storeSettings?.link_url ?? null}
      />
      {data.contentSection && (
        <LazyMount minHeight={600}>
          <PhotoSlider
            images={data.sliderImages}
            videos={data.videos}
            section={data.contentSection}
          />
        </LazyMount>
      )}
      <AboutSection />
      <StatsBanner />
      <LazyMount minHeight={700}>
        <ProdutoraSection images={data.aboutImages} />
      </LazyMount>
      {data.storeSettings && (
        <LazyMount minHeight={500}>
          <StoreSection settings={data.storeSettings} />
        </LazyMount>
      )}
      <LazyMount minHeight={200}>
        <Footer settings={data.footerSettings} />
      </LazyMount>
    </main>
  )
}
