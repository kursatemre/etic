'use client'

import { TrendingUp, ShoppingCart, Users, Package, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'

const stats = [
  {
    name: 'Toplam Satış',
    value: '₺45,231',
    change: '+20.1%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Siparişler',
    value: '356',
    change: '+12.5%',
    changeType: 'positive',
    icon: ShoppingCart,
  },
  {
    name: 'Müşteriler',
    value: '2,421',
    change: '+8.2%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Ürünler',
    value: '128',
    change: '-2.4%',
    changeType: 'negative',
    icon: Package,
  },
]

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Ahmet Yılmaz',
    amount: 1250,
    status: 'Tamamlandı',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Ayşe Kaya',
    amount: 890,
    status: 'İşleniyor',
    date: '2024-01-15',
  },
  {
    id: 'ORD-003',
    customer: 'Mehmet Demir',
    amount: 2100,
    status: 'Kargoda',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customer: 'Zeynep Çelik',
    amount: 560,
    status: 'Beklemede',
    date: '2024-01-14',
  },
  {
    id: 'ORD-005',
    customer: 'Can Arslan',
    amount: 1780,
    status: 'Tamamlandı',
    date: '2024-01-13',
  },
]

const topProducts = [
  { name: 'Wireless Kulaklık', sales: 145, revenue: 28900 },
  { name: 'Akıllı Saat', sales: 89, revenue: 35600 },
  { name: 'Bluetooth Hoparlör', sales: 67, revenue: 13400 },
  { name: 'Laptop Çantası', sales: 54, revenue: 8100 },
  { name: 'USB-C Hub', sales: 43, revenue: 6450 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Mağazanızın genel görünümü</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'positive' ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ml-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">Son 30 gün</span>
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₺{order.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            order.status === 'Tamamlandı'
                              ? 'badge-success'
                              : order.status === 'İşleniyor'
                              ? 'badge-warning'
                              : order.status === 'Kargoda'
                              ? 'badge-info'
                              : 'badge-danger'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">En Çok Satan Ürünler</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} satış</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₺{product.revenue.toLocaleString('tr-TR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
