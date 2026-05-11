import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  count: number
  icon: LucideIcon
  color?: string
}

export function DashboardCard({ label, count, icon: Icon, color = '#CC0000' }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-700 text-sm font-medium">{label}</p>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-gray-900 text-3xl font-bold">{count}</p>
    </div>
  )
}
