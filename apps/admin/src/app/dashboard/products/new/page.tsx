'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    sku: '',
    barcode: '',
    quantity: '',
    category: '',
    status: 'DRAFT',
    trackInventory: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call will be here
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Form data:', formData)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
            <p className="text-gray-600 mt-1">Kataloguna yeni ürün ekle</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/products" className="btn-secondary">
            İptal
          </Link>
          <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="title" className="label">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="input"
                  placeholder="Örn: Wireless Bluetooth Kulaklık"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className="input"
                  placeholder="Ürününüz hakkında detaylı bilgi..."
                  value={formData.description}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ürününüzün özelliklerini, kullanım alanlarını detaylandırın
                </p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Ürün Görselleri</h2>
            </div>
            <div className="card-body">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Görselleri sürükleyip bırakın veya tıklayın
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF - Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Fiyatlandırma</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="label">
                    Fiyat *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      step="0.01"
                      className="input pl-8"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="compareAtPrice" className="label">
                    İndirimli Fiyat
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                    <input
                      type="number"
                      id="compareAtPrice"
                      name="compareAtPrice"
                      step="0.01"
                      className="input pl-8"
                      placeholder="0.00"
                      value={formData.compareAtPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">İndirim göstermek için</p>
                </div>
              </div>

              <div>
                <label htmlFor="costPerItem" className="label">
                  Birim Maliyet
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                  <input
                    type="number"
                    id="costPerItem"
                    name="costPerItem"
                    step="0.01"
                    className="input pl-8"
                    placeholder="0.00"
                    value={formData.costPerItem}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Kâr marjı hesaplamak için</p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Stok Yönetimi</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sku" className="label">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    className="input"
                    placeholder="SKU-001"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="barcode" className="label">
                    Barkod
                  </label>
                  <input
                    type="text"
                    id="barcode"
                    name="barcode"
                    className="input"
                    placeholder="123456789"
                    value={formData.barcode}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="label">
                    Stok Adedi *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    className="input"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="trackInventory"
                  name="trackInventory"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  checked={formData.trackInventory}
                  onChange={handleChange}
                />
                <label htmlFor="trackInventory" className="ml-2 text-sm text-gray-700">
                  Stok takibi yap (stok bittiğinde satışı durdur)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Durum</h2>
            </div>
            <div className="card-body">
              <select
                name="status"
                className="input w-full"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="DRAFT">Taslak</option>
                <option value="ACTIVE">Aktif</option>
                <option value="ARCHIVED">Arşivlendi</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                {formData.status === 'ACTIVE'
                  ? 'Ürün mağazanızda görünür olacak'
                  : formData.status === 'DRAFT'
                  ? 'Ürün sadece admin panelde görünür'
                  : 'Ürün arşivlendi'}
              </p>
            </div>
          </div>

          {/* Organization */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Organizasyon</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="category" className="label">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  className="input w-full"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Kategori seçin</option>
                  <option value="elektronik">Elektronik</option>
                  <option value="giyim">Giyim</option>
                  <option value="aksesuar">Aksesuar</option>
                  <option value="ev-yasam">Ev & Yaşam</option>
                </select>
              </div>

              <div>
                <label className="label">Etiketler</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Virgülle ayırarak ekleyin"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Örn: yeni, popüler, indirimli
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
