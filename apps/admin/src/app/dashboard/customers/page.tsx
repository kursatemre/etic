'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, UserPlus, Mail, Phone, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          const customersResponse = await api.getCustomers(firstStore.id)
          if (customersResponse.success) {
            setCustomers(customersResponse.data)
          }
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase()
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
          <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-gray-600 mt-1">{customers.length} müşteri bulundu</p>
        </div>
        <button className="btn-primary">
          <UserPlus className="w-5 h-5 mr-2" />
          Yeni Müşteri
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Müşteri</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Aktif Müşteri</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {customers.filter((c) => c._count?.orders > 0).length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Yeni Müşteri (30 Gün)</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {
                customers.filter((c) => {
                  const createdAt = new Date(c.createdAt)
                  const thirtyDaysAgo = new Date()
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                  return createdAt > thirtyDaysAgo
                }).length
              }
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">E-posta Aboneliği</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {customers.filter((c) => c.acceptsMarketing).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri adı, email veya telefon ile ara..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Siparişler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marketing
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">Müşteri bulunamadı</p>
                      <p className="text-sm mt-1">Arama kriterlerinizi değiştirin</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'İsimsiz'
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/customers/${customer.id}`} className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-primary-600 hover:text-primary-700">{fullName}</p>
                            <p className="text-xs text-gray-500">#{customer.id.slice(0, 8)}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {customer._count?.orders || 0} sipariş
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {customer.acceptsMarketing ? (
                          <span className="badge badge-success">Abone</span>
                        ) : (
                          <span className="badge badge-secondary">Değil</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredCustomers.length} müşteriden 1-{Math.min(20, filteredCustomers.length)} arası
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
