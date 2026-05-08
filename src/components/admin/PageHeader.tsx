type Props = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h1 className="font-bebas text-white text-4xl tracking-wide">{title}</h1>
      {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
    </div>
  )
}
