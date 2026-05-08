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
