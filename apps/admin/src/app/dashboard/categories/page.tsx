'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, FolderTree } from 'lucide-react'
import { api } from '@/lib/api'

interface Category {
  id: string
  name: any
  slug: string
  description?: any
  parentId?: string | null
  order: number
  parent?: Category | null
  children?: Category[]
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const userResponse = await api.me()
      if (userResponse.success && userResponse.data.stores.length > 0) {
        const firstStore = userResponse.data.stores[0].store
        setStoreId(firstStore.id)

        const categoriesResponse = await api.getCategories(firstStore.id)
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Kategoriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (category: Category) => {
    if (typeof category.name === 'string') return category.name
    return category.name?.tr || category.name?.en || 'Kategori'
  }

  const getCategoryDescription = (category: Category) => {
    if (!category.description) return ''
    if (typeof category.description === 'string') return category.description
    return category.description?.tr || category.description?.en || ''
  }

  const generateSlug = (name: string): string => {
    return name
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

  const handleCreate = () => {
    setCreatingNew(true)
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      parentId: '',
      order: categories.length,
    })
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setCreatingNew(false)
    setFormData({
      name: getCategoryName(category),
      description: getCategoryDescription(category),
      parentId: category.parentId || '',
      order: category.order,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setCreatingNew(false)
    setFormData({
      name: '',
      description: '',
      parentId: '',
      order: 0,
    })
    setError(null)
  }

  const handleSave = async () => {
    if (!storeId || !formData.name.trim()) {
      setError('Kategori adı zorunludur')
      return
    }

    try {
      const slug = generateSlug(formData.name)
      const categoryData = {
        name: { tr: formData.name },
        description: formData.description ? { tr: formData.description } : undefined,
        slug,
        parentId: formData.parentId || null,
        order: formData.order,
      }

      if (creatingNew) {
        await api.createCategory(storeId, categoryData)
      } else if (editingId) {
        await api.updateCategory(storeId, editingId, categoryData)
      }

      await fetchCategories()
      handleCancel()
    } catch (error: any) {
      console.error('Error saving category:', error)
      setError(error.message || 'Kategori kaydedilirken hata oluştu')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!storeId) return
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    try {
      await api.deleteCategory(storeId, categoryId)
      await fetchCategories()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      setError(error.message || 'Kategori silinirken hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  // Separate root and child categories
  const rootCategories = categories.filter((c) => !c.parentId)
  const availableParents = categories.filter((c) => c.id !== editingId)

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-600 mt-1">{categories.length} kategori bulundu</p>
        </div>
        <button onClick={handleCreate} className="btn-primary" disabled={creatingNew}>
          <Plus className="w-5 h-5 mr-2" />
          Yeni Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Kategori</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Ana Kategoriler</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{rootCategories.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-gray-600">Toplam Ürün</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {categories.reduce((sum, c) => sum + (c._count?.products || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Üst Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ürün Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sıra
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* New Category Form */}
              {creatingNew && (
                <tr className="bg-blue-50">
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="input"
                      placeholder="Kategori adı"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="input"
                      placeholder="Açıklama"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="input"
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    >
                      <option value="">Ana Kategori</option>
                      {availableParents.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      className="input w-20"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Kaydet"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="İptal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Categories */}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FolderTree className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Henüz kategori yok</p>
                      <p className="text-sm mt-1">Yeni kategori eklemek için yukarıdaki butona tıklayın</p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => {
                  const isEditing = editingId === category.id

                  return (
                    <tr key={category.id} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            autoFocus
                          />
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getCategoryName(category)}
                            </p>
                            <p className="text-xs text-gray-500">{category.slug}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="input"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                          />
                        ) : (
                          <p className="text-sm text-gray-600">
                            {getCategoryDescription(category) || '-'}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            className="input"
                            value={formData.parentId}
                            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                          >
                            <option value="">Ana Kategori</option>
                            {availableParents.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {getCategoryName(cat)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm text-gray-600">
                            {category.parent ? getCategoryName(category.parent) : '-'}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {category._count?.products || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            className="input w-20"
                            value={formData.order}
                            onChange={(e) =>
                              setFormData({ ...formData, order: parseInt(e.target.value) })
                            }
                          />
                        ) : (
                          <span className="text-sm text-gray-600">{category.order}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSave}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Kaydet"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="İptal"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Düzenle"
                                disabled={creatingNew}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Sil"
                                disabled={creatingNew || editingId !== null}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
