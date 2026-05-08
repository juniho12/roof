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
