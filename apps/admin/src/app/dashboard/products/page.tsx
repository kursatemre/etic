'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Kulaklık',
    sku: 'WBK-001',
    category: 'Elektronik',
    price: 299.99,
    stock: 45,
    status: 'ACTIVE',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Akıllı Saat Pro',
    sku: 'AS-PRO-001',
    category: 'Elektronik',
    price: 1299.99,
    stock: 12,
    status: 'ACTIVE',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'USB-C Hub 7in1',
    sku: 'USBC-HUB-7',
    category: 'Aksesuar',
    price: 249.99,
    stock: 0,
    status: 'DRAFT',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '4',
    name: 'Laptop Sırt Çantası',
    sku: 'LSC-001',
    category: 'Çanta',
    price: 199.99,
    stock: 23,
    status: 'ACTIVE',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '5',
    name: 'Mekanik Klavye RGB',
    sku: 'MK-RGB-001',
    category: 'Bilgisayar',
    price: 899.99,
    stock: 8,
    status: 'ARCHIVED',
    image: 'https://via.placeholder.com/100',
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600 mt-1">{products.length} ürün bulundu</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün adı veya SKU ile ara..."
                  className="input pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <select
                className="input w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="ACTIVE">Aktif</option>
                <option value="DRAFT">Taslak</option>
                <option value="ARCHIVED">Arşivlendi</option>
              </select>
            </div>

            {/* More Filters */}
            <button className="btn-secondary">
              <Filter className="w-5 h-5 mr-2" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stok
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">Ürün bulunamadı</p>
                      <p className="text-sm mt-1">Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₺{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stock > 10
                            ? 'text-green-600'
                            : product.stock > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${
                          product.status === 'ACTIVE'
                            ? 'badge-success'
                            : product.status === 'DRAFT'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {product.status === 'ACTIVE'
                          ? 'Aktif'
                          : product.status === 'DRAFT'
                          ? 'Taslak'
                          : 'Arşivlendi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} üründen 1-{Math.min(10, filteredProducts.length)} arası gösteriliyor
            </p>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary px-3 py-1 text-sm">Önceki</button>
              <button className="btn-primary px-3 py-1 text-sm">1</button>
              <button className="btn-secondary px-3 py-1 text-sm">2</button>
              <button className="btn-secondary px-3 py-1 text-sm">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
