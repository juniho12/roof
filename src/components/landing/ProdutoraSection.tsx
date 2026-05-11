import Image from 'next/image'
import type { AboutImage } from '@/types/database'

type Props = {
  images: AboutImage[]
}

export function ProdutoraSection({ images }: Props) {
  return (
    <section className="py-16 bg-[#140004]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              A PRODUTORA<span className="text-[hsl(0,84%,50%)]">.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              A ROOF! nasceu em 2019 e hoje é referência em eventos de funk open bar
              em SP, com labels como: Baile da ROOF!, Subverso e Collabs com artistas
              da cena.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.slice(0, 4).map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={img.image_url}
                  alt={img.alt_text ?? 'ROOF! Produtora'}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
