'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FolderTree,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Ürünler',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Siparişler',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Müşteriler',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Kategoriler',
    href: '/dashboard/categories',
    icon: FolderTree,
  },
  {
    title: 'Mağazam',
    href: '/dashboard/store',
    icon: Store,
  },
  {
    title: 'Raporlar',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Ayarlar',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900">ETIC</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
