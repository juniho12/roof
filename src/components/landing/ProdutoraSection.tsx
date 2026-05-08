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
