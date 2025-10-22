'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'

interface DashboardNavProps {
  user: User
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-slate-900">
          Cane Corso Academy
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/dashboard/courses">
            <Button variant="ghost">Courses</Button>
          </Link>
          <Link href="/dashboard/community">
            <Button variant="ghost">Community</Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  )
}
