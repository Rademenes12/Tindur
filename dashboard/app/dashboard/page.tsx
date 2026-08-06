'use client'
import { useEffect, useState } from 'react'
import StatsCard from '@/components/dashboard/StatsCard'

export default function DashboardPage() {
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, pending: 0 })
  
  useEffect(() => {
    setStats({ bookings: 42, revenue: 4200, pending: 5 })
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Bookings Today" value={stats.bookings} />
        <StatsCard title="Revenue" value={"$" + stats.revenue} />
        <StatsCard title="Pending" value={stats.pending} />
      </div>
    </div>
  )
}
