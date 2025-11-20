'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Truck, Shield } from 'lucide-react'
import { storefrontApi } from '@/lib/api'
import { formatCurrency, getMultiLanguageValue } from '@/lib/utils'

// Hardcoded store ID for demo
const STORE_ID = 'cmi6ofmxy00019bufyhxwyudy'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await storefrontApi.getProduct(STORE_ID, slug)

      if (response.success) {
        setProduct(response.data)
      }
    } catch (error: any) {
      console.error('Error fetching product:', error)
      setError('Ürün yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && (!product.trackInventory || newQuantity <= product.quantity)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              ETIC Store
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Ürün bulunamadı'}
          </div>
          <Link href="/shop" className="inline-flex items-center text-primary-600 hover:text-primary-700 mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ürünlere Dön
          </Link>
        </div>
      </div>
    )
  }

  const title = getMultiLanguageValue(product.title)
  const description = getMultiLanguageValue(product.description)
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-product.jpg']
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0
  const inStock = !product.trackInventory || product.quantity > 0

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
              <button className="relative p-2 text-gray-700 hover:text-primary-600">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/shop" className="hover:text-primary-600">
            Ürünler
          </Link>
          <span>/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {hasDiscount && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                  %{discountPercentage} İNDİRİM
                </span>
              )}
              <img
                src={images[selectedImage]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(Number(product.price))}
              </p>
              {hasDiscount && (
                <p className="text-xl text-gray-500 line-through">
                  {formatCurrency(Number(product.compareAtPrice))}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <div className="flex items-center text-green-600">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="font-medium">Stokta Var</span>
                  {product.trackInventory && (
                    <span className="text-gray-600 ml-2">({product.quantity} adet)</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="font-medium">Stokta Yok</span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Açıklama</h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            {inStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adet
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={product.trackInventory && quantity >= product.quantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              disabled={!inStock}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-6"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{inStock ? 'Sepete Ekle' : 'Stokta Yok'}</span>
            </button>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <Truck className="w-5 h-5 mr-3 text-primary-600" />
                <span>Ücretsiz kargo (500₺ üzeri)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Shield className="w-5 h-5 mr-3 text-primary-600" />
                <span>Güvenli ödeme</span>
              </div>
            </div>

            {/* Product Details */}
            {(product.sku || product.barcode) && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Ürün Detayları</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span>SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.barcode && (
                    <div className="flex justify-between">
                      <span>Barkod:</span>
                      <span className="font-medium">{product.barcode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
