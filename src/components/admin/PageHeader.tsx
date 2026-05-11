type Props = {
  title: string
  description?: string
}

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-5xl text-gray-900">{title}</h1>
      {description && <p className="text-gray-500 mt-2">{description}</p>}
    </div>
  )
}
