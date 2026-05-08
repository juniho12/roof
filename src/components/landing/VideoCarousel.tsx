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
