'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, X } from 'lucide-react'
import { api } from '@/lib/api'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    sku: '',
    barcode: '',
    quantity: '',
    categoryIds: [] as string[],
    status: 'DRAFT',
    trackInventory: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.me()
        if (userResponse.success && userResponse.data.stores.length > 0) {
          const firstStore = userResponse.data.stores[0].store
          setStoreId(firstStore.id)

          // Fetch categories
          const categoriesResponse = await api.getCategories(firstStore.id)
          if (categoriesResponse.success) {
            setCategories(categoriesResponse.data)
          }

          // Fetch product
          const productResponse = await api.getProduct(firstStore.id, productId)
          if (productResponse.success) {
            const product = productResponse.data
            const title = typeof product.title === 'string'
              ? product.title
              : (product.title?.tr || product.title?.en || '')
            const description = typeof product.description === 'string'
              ? product.description
              : (product.description?.tr || product.description?.en || '')

            setFormData({
              title,
              description,
              price: product.price.toString(),
              compareAtPrice: product.compareAtPrice?.toString() || '',
              sku: product.sku || '',
              barcode: product.barcode || '',
              quantity: product.quantity.toString(),
              categoryIds: product.categories?.map((c: any) => c.categoryId) || [],
              status: product.status,
              trackInventory: product.trackInventory,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Veriler yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value && !formData.categoryIds.includes(value)) {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, value],
      })
    }
  }

  const removeCategory = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
    })
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!storeId) {
      setError('Mağaza bilgisi bulunamadı')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const slug = generateSlug(formData.title)

      const productData = {
        title: { tr: formData.title },
        description: formData.description ? { tr: formData.description } : undefined,
        slug,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        trackInventory: formData.trackInventory,
        quantity: parseInt(formData.quantity) || 0,
        status: formData.status,
      }

      await api.updateProduct(storeId, productId, productData)
      router.push('/dashboard/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      setError(error.message || 'Ürün güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!storeId) return
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      await api.deleteProduct(storeId, productId)
      router.push('/dashboard/products')
    } catch (error: any) {
      console.error('Error deleting product:', error)
      setError(error.message || 'Ürün silinirken hata oluştu')
    }
  }

  const getCategoryName = (category: any) => {
    if (typeof category.name === 'string') return category.name
    return category.name?.tr || category.name?.en || 'Kategori'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
            <h1 className="text-2xl font-bold text-gray-900">Ürünü Düzenle</h1>
            <p className="text-gray-600 mt-1">Ürün bilgilerini güncelle</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Sil
          </button>
          <Link href="/dashboard/products" className="btn-secondary">
            İptal
          </Link>
          <button onClick={handleSubmit} className="btn-primary" disabled={saving}>
            {saving ? (
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
                Güncelle
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
                </div>
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
                  Stok takibi yap
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
                  className="input w-full"
                  onChange={handleCategoryChange}
                  value=""
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryName(category)}
                    </option>
                  ))}
                </select>
                {formData.categoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.categoryIds.map((categoryId) => {
                      const category = categories.find((c) => c.id === categoryId)
                      if (!category) return null
                      return (
                        <span
                          key={categoryId}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                        >
                          {getCategoryName(category)}
                          <button
                            type="button"
                            onClick={() => removeCategory(categoryId)}
                            className="hover:text-primary-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
