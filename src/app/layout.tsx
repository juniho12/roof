import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ROOF! a produtora',
  description: 'Transformando eventos em experiências inesquecíveis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
