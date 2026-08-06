'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Experiences', href: '/dashboard/experiences' },
  { name: 'Bookings', href: '/dashboard/bookings' },
  { name: 'Calendar', href: '/dashboard/calendar' },
  { name: 'Reports', href: '/dashboard/reports' },
  { name: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-sidebar border-r border-border p-4">
      <div className="text-2xl font-bold text-primary mb-8">Tindur</div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}
            className={pathname === item.href ? "block px-4 py-2 bg-primary rounded-lg text-white" : "block px-4 py-2 hover:bg-muted rounded-lg"}>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
