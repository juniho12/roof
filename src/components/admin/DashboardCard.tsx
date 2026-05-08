import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  count: number
  icon: LucideIcon
  color?: string
}

export function DashboardCard({ label, count, icon: Icon, color = '#CC0000' }: Props) {
  return (
    <div className="bg-roof-sidebar border border-white/10 p-6 flex items-center justify-between">
      <div>
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-white text-3xl font-bold">{count}</p>
      </div>
      <Icon size={28} style={{ color }} />
    </div>
  )
}
