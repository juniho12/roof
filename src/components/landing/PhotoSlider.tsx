'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { SliderImage, ContentSectionSettings, VideoCarouselItem } from '@/types/database'

type Props = {
  images: SliderImage[]
  videos: VideoCarouselItem[]
  section: ContentSectionSettings
}

function ImageCard({ images }: { images: SliderImage[] }) {
  const [idx, setIdx] = useState(0)
  const active = images.filter((i) => i.is_active)

  useEffect(() => {
    if (active.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % active.length), 5000)
    return () => clearInterval(t)
  }, [active.length])

  if (active.length === 0) {
    return <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
  }

  const open = (url: string | null) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIdx((i) => (i === 0 ? active.length - 1 : i - 1))
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIdx((i) => (i + 1) % active.length)
  }

  return (
    <div className="relative w-full h-full group">
      {active.map((img, i) => (
        <div
          key={img.id}
          onClick={() => open(img.link_url)}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          } ${img.link_url ? 'cursor-pointer' : ''}`}
        >
          <Image
            src={img.image_url}
            alt={img.alt_text ?? `Slide ${i + 1}`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      ))}
      {active.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Próximo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {active.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx(i)
                }}
                aria-label={`Slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === idx ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function VideoCard({ videos }: { videos: VideoCarouselItem[] }) {
  const [idx, setIdx] = useState(0)
  const active = videos.filter((v) => v.is_active)

  useEffect(() => {
    if (active.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % active.length), 5000)
    return () => clearInterval(t)
  }, [active.length])

  if (active.length === 0) {
    return <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
  }

  const open = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIdx((i) => (i === 0 ? active.length - 1 : i - 1))
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIdx((i) => (i + 1) % active.length)
  }

  return (
    <div className="relative w-full h-full group cursor-pointer" onClick={() => open(active[idx].video_url)}>
      {active.map((v, i) => (
        <div
          key={v.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {v.thumbnail_url ? (
            <Image
              src={v.thumbnail_url}
              alt={v.title ?? `Vídeo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
          )}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="w-16 h-16 rounded-full bg-roof-red flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>
      {active.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Próximo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {active.map((v, i) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setIdx(i)
                }}
                aria-label={`Vídeo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === idx ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function PhotoSlider({ images, videos, section }: Props) {
  return (
    <section className="py-16 bg-[#99001f]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-3">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-white/80 max-w-2xl mx-auto">{section.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/20">
            <ImageCard images={images} />
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/20">
            <VideoCard videos={videos} />
          </div>
        </div>
      </div>
    </section>
  )
}
