import Image from 'next/image'
import type { StoreSettings } from '@/types/database'

type Props = {
  settings: StoreSettings
}

export function StoreSection({ settings }: Props) {
  const images = [settings.image_1_url, settings.image_2_url, settings.image_3_url]
  const link = settings.link_url

  return (
    <section className="py-16 bg-[#99001f]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-3">
            LOJA OFICIAL DA ROOF
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Retire sua peça favorita em nossos eventos ou combine a retirada
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {images.map((url, i) => {
            const inner = url ? (
              <Image
                quality={60}
                src={url}
                alt={`Loja ROOF ${i + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 33vw, 100vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
            )

            return (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/20"
              >
                {url && link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 cursor-pointer"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
