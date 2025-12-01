'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              ETIC Store
            </Link>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">
              Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimize göz atın!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shippingCost = totalPrice >= 500 ? 0 : 50
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ETIC Store
          </Link>
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
          <span className="text-gray-900">Sepetim</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sepetim</h1>
            <p className="text-gray-600 mt-1">{totalItems} ürün</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Alışverişe Devam Et
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.productId} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 block truncate"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-2 flex items-center space-x-2">
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(item.price)}
                        </p>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(item.compareAtPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Sepetten Kaldır"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.maxQuantity !== undefined && item.quantity >= item.maxQuantity}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo</span>
                  <span className="font-medium text-gray-900">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      formatCurrency(shippingCost)
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <div className="text-sm text-gray-500">
                    {formatCurrency(500 - totalPrice)} değerinde daha ürün ekleyerek ücretsiz kargo
                    kazanın!
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Toplam</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2"
              >
                <span>Ödemeye Geç</span>
              </Link>

              <Link
                href="/shop"
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
