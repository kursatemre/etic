const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class StorefrontApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data: T; meta?: any }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Products - Public endpoints
  async getProducts(storeId: string, params?: {
    page?: number
    limit?: number
    categoryId?: string
    search?: string
    featured?: boolean
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId)
    if (params?.search) queryParams.set('search', params.search)
    if (params?.featured !== undefined) queryParams.set('featured', params.featured.toString())

    const query = queryParams.toString()
    return this.request<any[]>(`/stores/${storeId}/products${query ? `?${query}` : ''}`)
  }

  async getProduct(storeId: string, slug: string) {
    return this.request<any>(`/stores/${storeId}/products/${slug}`)
  }

  // Categories - Public endpoints
  async getCategories(storeId: string) {
    return this.request<any[]>(`/stores/${storeId}/categories`)
  }

  async getCategory(storeId: string, slug: string) {
    return this.request<any>(`/stores/${storeId}/categories/${slug}`)
  }

  // Store info
  async getStore(storeId: string) {
    return this.request<any>(`/stores/${storeId}`)
  }
}

export const storefrontApi = new StorefrontApiClient()
