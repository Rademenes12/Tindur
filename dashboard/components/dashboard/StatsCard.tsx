interface StatsCardProps {
  title: string
  value: string | number
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-sm text-green-600">+12% vs last week</p>
    </div>
  )
}
