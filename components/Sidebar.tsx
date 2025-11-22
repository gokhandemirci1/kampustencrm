'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Code,
  BarChart3,
  UserCog,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: null, // Herkes görebilir
    },
    {
      name: 'Müşteri Yönetimi',
      href: '/dashboard/customers',
      icon: Users,
      permission: 'canManageCustomers',
    },
    {
      name: 'Finansal Veriler',
      href: '/dashboard/financial',
      icon: DollarSign,
      permission: 'canManageFinancial',
    },
    {
      name: 'İşbirliği Kodları',
      href: '/dashboard/collaboration-codes',
      icon: Code,
      permission: 'canManageCollaborationCodes',
    },
    {
      name: 'İşbirliği İstatistikleri',
      href: '/dashboard/collaboration-stats',
      icon: BarChart3,
      permission: 'canViewCollaborationStats',
    },
    {
      name: 'Erişim Yönetimi',
      href: '/dashboard/access',
      icon: UserCog,
      permission: 'canManageAccess',
    },
  ]

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.permission) return true
    return session.user[item.permission as keyof typeof session.user] === true
  })

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-400 mt-1">{session.user.email}</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}
