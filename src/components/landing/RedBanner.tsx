type Props = {
  title: string
}

export function RedBanner({ title }: Props) {
  return (
    <div className="w-full bg-roof-red py-6 px-4">
      <p className="font-display text-center text-white text-4xl md:text-5xl tracking-wide leading-tight">
        {title}
      </p>
    </div>
  )
}
