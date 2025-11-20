'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  Edit2,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING: { color: 'badge-warning', label: 'Beklemede' },
    CONFIRMED: { color: 'badge-info', label: 'Onaylandı' },
    PROCESSING: { color: 'badge-info', label: 'İşleniyor' },
    SHIPPED: { color: 'badge-info', label: 'Kargoda' },
    DELIVERED: { color: 'badge-success', label: 'Teslim Edildi' },
    CANCELLED: { color: 'badge-danger', label: 'İptal' },
  }

  const config = statusConfig[status] || { color: 'badge-info', label: status }
  return <span className={`badge ${config.color}`}>{config.label}</span>
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          const customerResponse = await api.getCustomer(firstStore.id, customerId)
          if (customerResponse.success) {
            setCustomer(customerResponse.data)
          }
        }
      } catch (error: any) {
        console.error('Error fetching customer:', error)
        setError('Müşteri yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [customerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Müşteri bulunamadı'}
        </div>
        <Link href="/dashboard/customers" className="btn-secondary inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Müşterilere Dön
        </Link>
      </div>
    )
  }

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'İsimsiz'
  const totalSpent = customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total), 0) || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/customers"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-medium">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-gray-600 mt-1">{customer.email}</p>
            </div>
          </div>
        </div>
        <button className="btn-secondary">
          <Edit2 className="w-4 h-4 mr-2" />
          Düzenle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{customer.orders?.length || 0}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Harcama</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Ortalama Sipariş</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {customer.orders?.length > 0 ? formatCurrency(totalSpent / customer.orders.length) : formatCurrency(0)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Kayıt Tarihi</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Son Siparişler
              </h2>
            </div>
            <div className="card-body p-0">
              {customer.orders?.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">Henüz sipariş yok</p>
                  <p className="text-sm mt-1">Bu müşteri henüz sipariş vermedi</p>
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
                          Tarih
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
                      {customer.orders?.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                              #{order.orderNumber || order.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(Number(order.total))}
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(order.orderStatus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Adresler
              </h2>
            </div>
            <div className="card-body">
              {customer.addresses?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg font-medium">Henüz adres yok</p>
                  <p className="text-sm mt-1">Bu müşteri henüz adres eklemedi</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.addresses?.map((address: any) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      {address.isDefault && (
                        <span className="badge badge-primary mb-2">Varsayılan</span>
                      )}
                      <p className="font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">{address.address1}</p>
                      {address.address2 && (
                        <p className="text-sm text-gray-600">{address.address2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.province} {address.zip}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                      {address.phone && (
                        <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Müşteri Bilgileri
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">E-posta</p>
                  <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>

              {customer.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Kayıt Tarihi</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>

              {customer.lastOrderAt && (
                <div className="flex items-start space-x-3">
                  <ShoppingBag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Son Sipariş</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(customer.lastOrderAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Marketing */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Marketing</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-posta Aboneliği</span>
                  {customer.acceptsMarketing ? (
                    <span className="badge badge-success">Abone</span>
                  ) : (
                    <span className="badge badge-secondary">Değil</span>
                  )}
                </div>
                {customer.acceptsMarketing && customer.marketingOptInAt && (
                  <p className="text-xs text-gray-500">
                    Abone oldu: {formatDate(customer.marketingOptInAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold">Etiketler</h2>
              </div>
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag: string, index: number) => (
                    <span key={index} className="badge badge-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
