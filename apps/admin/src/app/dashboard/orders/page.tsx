'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Download, Eye, MoreVertical } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

const getStatusBadge = (status: string, type: 'order' | 'payment' | 'fulfillment') => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    // Order Status
    PENDING: { color: 'badge-warning', label: 'Beklemede' },
    CONFIRMED: { color: 'badge-info', label: 'Onaylandı' },
    PROCESSING: { color: 'badge-info', label: 'İşleniyor' },
    SHIPPED: { color: 'badge-info', label: 'Kargoda' },
    DELIVERED: { color: 'badge-success', label: 'Teslim Edildi' },
    CANCELLED: { color: 'badge-danger', label: 'İptal' },
    // Payment Status
    PAID: { color: 'badge-success', label: 'Ödendi' },
    PARTIALLY_PAID: { color: 'badge-warning', label: 'Kısmi Ödendi' },
    REFUNDED: { color: 'badge-danger', label: 'İade Edildi' },
    FAILED: { color: 'badge-danger', label: 'Başarısız' },
    // Fulfillment Status
    UNFULFILLED: { color: 'badge-warning', label: 'Hazırlanıyor' },
    PARTIALLY_FULFILLED: { color: 'badge-warning', label: 'Kısmi Teslim' },
    FULFILLED: { color: 'badge-success', label: 'Tamamlandı' },
  }

  const config = statusConfig[status] || { color: 'badge-info', label: status }
  return <span className={`badge ${config.color}`}>{config.label}</span>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          const ordersResponse = await api.getOrders(firstStore.id)
          if (ordersResponse.success) {
            setOrders(ordersResponse.data)
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase()
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.orderStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-600 mt-1">{orders.length} sipariş bulundu</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-5 h-5 mr-2" />
          Dışa Aktar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {orders.filter((o) => o.orderStatus === 'PENDING').length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">İşleniyor</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {orders.filter((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'CONFIRMED').length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Tamamlanan</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {orders.filter((o) => o.orderStatus === 'DELIVERED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sipariş no, müşteri adı veya email ile ara..."
                  className="input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <select
                className="input w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="PENDING">Beklemede</option>
                <option value="CONFIRMED">Onaylandı</option>
                <option value="PROCESSING">İşleniyor</option>
                <option value="SHIPPED">Kargoda</option>
                <option value="DELIVERED">Teslim Edildi</option>
                <option value="CANCELLED">İptal</option>
              </select>
            </div>

            <button className="btn-secondary">
              <Filter className="w-5 h-5 mr-2" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ödeme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teslimat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">Sipariş bulunamadı</p>
                      <p className="text-sm mt-1">Arama kriterlerinizi değiştirin</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items?.length || 0
                  const customerName = order.customer
                    ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()
                    : 'Misafir'
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customerName}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(Number(order.total))}
                          </p>
                          <p className="text-xs text-gray-500">{itemCount} ürün</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.paymentStatus, 'payment')}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.fulfillmentStatus, 'fulfillment')}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(order.orderStatus, 'order')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredOrders.length} siparişten 1-{Math.min(10, filteredOrders.length)} arası
              gösteriliyor
            </p>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary px-3 py-1 text-sm">Önceki</button>
              <button className="btn-primary px-3 py-1 text-sm">1</button>
              <button className="btn-secondary px-3 py-1 text-sm">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
