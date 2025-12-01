'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, ShoppingCart } from 'lucide-react'
import { storefrontApi } from '@/lib/api'
import { formatCurrency, getMultiLanguageValue } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

// Hardcoded store ID for demo - in production this would come from domain/subdomain
const STORE_ID = 'cmi6ofmxy00019bufyhxwyudy'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { addItem, totalItems } = useCart()

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        storefrontApi.getProducts(STORE_ID, {
          status: 'ACTIVE',
          ...(selectedCategory && { categoryId: selectedCategory }),
        }),
        storefrontApi.getCategories(STORE_ID),
      ])

      if (productsResponse.success) {
        setProducts(productsResponse.data)
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const title = getMultiLanguageValue(product.title)
    return title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              ETIC Store
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/shop" className="text-gray-700 hover:text-primary-600">
                Ürünler
              </Link>
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600 mt-2">{filteredProducts.length} ürün bulundu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ara
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriler
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === ''
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tümü
                  </button>
                  {categories
                    .filter((cat) => cat.isVisible)
                    .map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === category.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {getMultiLanguageValue(category.name)}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinizi değiştirin veya filtreleri temizleyin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const title = getMultiLanguageValue(product.title)
                  const description = getMultiLanguageValue(product.description)
                  const image = product.images?.[0] || '/placeholder-product.jpg'
                  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
                  const discountPercentage = hasDiscount
                    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                    : 0

                  const inStock = !product.trackInventory || product.quantity > 0

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                      <Link href={`/shop/${product.slug}`}>
                        <div className="relative aspect-square bg-gray-100">
                          {hasDiscount && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                              %{discountPercentage}
                            </span>
                          )}
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          {!inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                                Stokta Yok
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600">
                            {title}
                          </h3>
                          {description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
                          )}
                        </Link>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-gray-900">
                              {formatCurrency(Number(product.price))}
                            </p>
                            {hasDiscount && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatCurrency(Number(product.compareAtPrice))}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              if (inStock) {
                                addItem({
                                  id: product.id,
                                  productId: product.id,
                                  title,
                                  slug: product.slug,
                                  price: Number(product.price),
                                  compareAtPrice: product.compareAtPrice
                                    ? Number(product.compareAtPrice)
                                    : undefined,
                                  image,
                                  maxQuantity: product.trackInventory ? product.quantity : undefined,
                                })
                              }
                            }}
                            disabled={!inStock}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
