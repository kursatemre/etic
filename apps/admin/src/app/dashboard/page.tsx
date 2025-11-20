'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          const statsResponse = await api.getStats(firstStore.id)
          if (statsResponse.success) {
            setStats(statsResponse.data)
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  const statsCards = [
    {
      name: 'Toplam Satış',
      value: formatCurrency(stats.stats.totalSales),
      icon: DollarSign,
    },
    {
      name: 'Siparişler',
      value: stats.stats.totalOrders.toString(),
      icon: ShoppingCart,
    },
    {
      name: 'Müşteriler',
      value: stats.stats.totalCustomers.toString(),
      icon: Users,
    },
    {
      name: 'Ürünler',
      value: `${stats.stats.activeProducts}/${stats.stats.totalProducts}`,
      icon: Package,
    },
  ]

  const getOrderStatus = (order: any) => {
    if (order.status === 'DELIVERED') return { label: 'Tamamlandı', class: 'badge-success' }
    if (order.status === 'PROCESSING') return { label: 'İşleniyor', class: 'badge-warning' }
    if (order.status === 'SHIPPED') return { label: 'Kargoda', class: 'badge-info' }
    if (order.status === 'PENDING') return { label: 'Beklemede', class: 'badge-warning' }
    return { label: order.status, class: 'badge-secondary' }
  }

  const getProductTitle = (product: any) => {
    if (!product) return 'Ürün'
    if (typeof product.title === 'string') return product.title
    return product.title?.tr || product.title?.en || 'Ürün'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Mağazanızın genel görünümü</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
          </div>
          <div className="card-body p-0">
            {stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Henüz sipariş yok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sipariş No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentOrders.map((order: any) => {
                      const status = getOrderStatus(order)
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{order.orderNumber || order.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatCurrency(Number(order.total))}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`badge ${status.class}`}>{status.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">En Çok Satan Ürünler</h2>
          </div>
          <div className="card-body">
            {stats.topProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Henüz satış verisi yok</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topProducts.map((item: any, index: number) => (
                  <div key={item.product?.id || index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getProductTitle(item.product)}
                        </p>
                        <p className="text-xs text-gray-500">{item.quantitySold} satış</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.product ? formatCurrency(Number(item.product.price) * item.quantitySold) : '-'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
