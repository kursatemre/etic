'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

const getStatusBadge = (status: string, type: 'order' | 'payment' | 'fulfillment') => {
  const orderStatusConfig: Record<string, { color: string; label: string }> = {
    PENDING: { color: 'badge-warning', label: 'Beklemede' },
    CONFIRMED: { color: 'badge-info', label: 'Onaylandı' },
    PROCESSING: { color: 'badge-info', label: 'İşleniyor' },
    SHIPPED: { color: 'badge-info', label: 'Kargoda' },
    DELIVERED: { color: 'badge-success', label: 'Teslim Edildi' },
    CANCELLED: { color: 'badge-danger', label: 'İptal' },
    REFUNDED: { color: 'badge-danger', label: 'İade Edildi' },
  }

  const paymentStatusConfig: Record<string, { color: string; label: string }> = {
    PAID: { color: 'badge-success', label: 'Ödendi' },
    PENDING: { color: 'badge-warning', label: 'Bekliyor' },
    PARTIALLY_PAID: { color: 'badge-warning', label: 'Kısmi Ödendi' },
    PARTIALLY_REFUNDED: { color: 'badge-warning', label: 'Kısmi İade' },
    REFUNDED: { color: 'badge-danger', label: 'İade Edildi' },
    FAILED: { color: 'badge-danger', label: 'Başarısız' },
  }

  const fulfillmentStatusConfig: Record<string, { color: string; label: string }> = {
    UNFULFILLED: { color: 'badge-warning', label: 'Hazırlanıyor' },
    PARTIALLY_FULFILLED: { color: 'badge-warning', label: 'Kısmi Teslim' },
    FULFILLED: { color: 'badge-success', label: 'Tamamlandı' },
    CANCELLED: { color: 'badge-danger', label: 'İptal' },
  }

  const configMap = {
    order: orderStatusConfig,
    payment: paymentStatusConfig,
    fulfillment: fulfillmentStatusConfig,
  }

  const config = configMap[type][status] || { color: 'badge-info', label: status }
  return <span className={`badge ${config.color}`}>{config.label}</span>
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          const orderResponse = await api.getOrder(firstStore.id, orderId)
          if (orderResponse.success) {
            setOrder(orderResponse.data)
          }
        }
      } catch (error: any) {
        console.error('Error fetching order:', error)
        setError('Sipariş yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!storeId || !order) return

    setUpdating(true)
    try {
      await api.updateOrderStatus(storeId, order.id, newStatus)
      setOrder({ ...order, orderStatus: newStatus })
    } catch (error: any) {
      console.error('Error updating status:', error)
      setError('Durum güncellenirken hata oluştu')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Sipariş bulunamadı'}
        </div>
        <Link href="/dashboard/orders" className="btn-secondary inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Siparişlere Dön
        </Link>
      </div>
    )
  }

  const customerName = order.customer
    ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()
    : 'Misafir'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sipariş #{order.orderNumber || order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(order.orderStatus, 'order')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Sipariş Kalemleri
              </h2>
            </div>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ürün
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Birim Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Adet
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Toplam
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            {item.sku && (
                              <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatCurrency(Number(item.price))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(Number(item.price) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 px-6 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="text-gray-900">{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">İndirim</span>
                    <span className="text-green-600">
                      -{formatCurrency(Number(order.discount))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vergi</span>
                  <span className="text-gray-900">{formatCurrency(Number(order.tax))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-gray-900">
                    {formatCurrency(Number(order.shipping))}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Toplam</span>
                  <span>{formatCurrency(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Müşteri Bilgileri
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{customerName}</p>
                <p className="text-sm text-gray-600">{order.email}</p>
                {order.phone && <p className="text-sm text-gray-600">{order.phone}</p>}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Fatura Adresi
                </h2>
              </div>
              <div className="card-body space-y-2 text-sm">
                {order.billingAddress ? (
                  <>
                    <p className="font-medium">
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                    <p className="text-gray-600">{order.billingAddress.address1}</p>
                    {order.billingAddress.address2 && (
                      <p className="text-gray-600">{order.billingAddress.address2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.billingAddress.city}, {order.billingAddress.province}
                    </p>
                    <p className="text-gray-600">
                      {order.billingAddress.country} {order.billingAddress.zip}
                    </p>
                    {order.billingAddress.phone && (
                      <p className="text-gray-600">{order.billingAddress.phone}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Adres bilgisi yok</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Teslimat Adresi
                </h2>
              </div>
              <div className="card-body space-y-2 text-sm">
                {order.shippingAddress ? (
                  <>
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && (
                      <p className="text-gray-600">{order.shippingAddress.address2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.province}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country} {order.shippingAddress.zip}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="text-gray-600">{order.shippingAddress.phone}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Adres bilgisi yok</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Sipariş Durumu</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="label">Durum Güncelle</label>
                <select
                  className="input w-full"
                  value={order.orderStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="CONFIRMED">Onaylandı</option>
                  <option value="PROCESSING">İşleniyor</option>
                  <option value="SHIPPED">Kargoda</option>
                  <option value="DELIVERED">Teslim Edildi</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ödeme Durumu</span>
                  {getStatusBadge(order.paymentStatus, 'payment')}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Teslimat Durumu</span>
                  {getStatusBadge(order.fulfillmentStatus, 'fulfillment')}
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.note && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Sipariş Notu</h2>
              </div>
              <div className="card-body">
                <p className="text-sm text-gray-600">{order.note}</p>
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Sipariş Bilgileri</h2>
            </div>
            <div className="card-body space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sipariş No</span>
                <span className="font-medium">
                  #{order.orderNumber || order.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Oluşturma</span>
                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Güncelleme</span>
                  <span className="text-gray-900">{formatDate(order.updatedAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Para Birimi</span>
                <span className="text-gray-900">{order.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
