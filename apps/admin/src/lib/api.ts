const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data: T; meta?: any }> {
    const token = this.getToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
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

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async me() {
    return this.request<any>('/auth/me')
  }

  // Products
  async getProducts(storeId: string, params?: {
    page?: number
    limit?: number
    status?: string
    featured?: boolean
    search?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.status) queryParams.set('status', params.status)
    if (params?.featured !== undefined) queryParams.set('featured', params.featured.toString())
    if (params?.search) queryParams.set('search', params.search)

    const query = queryParams.toString()
    return this.request<any[]>(`/stores/${storeId}/products${query ? `?${query}` : ''}`)
  }

  async getProduct(storeId: string, productId: string) {
    return this.request<any>(`/stores/${storeId}/products/${productId}`)
  }

  async createProduct(storeId: string, data: any) {
    return this.request<any>(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(storeId: string, productId: string, data: any) {
    return this.request<any>(`/stores/${storeId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(storeId: string, productId: string) {
    return this.request<any>(`/stores/${storeId}/products/${productId}`, {
      method: 'DELETE',
    })
  }

  // Categories
  async getCategories(storeId: string) {
    return this.request<any[]>(`/stores/${storeId}/categories`)
  }

  async getCategory(storeId: string, categoryId: string) {
    return this.request<any>(`/stores/${storeId}/categories/${categoryId}`)
  }

  async createCategory(storeId: string, data: any) {
    return this.request<any>(`/stores/${storeId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(storeId: string, categoryId: string, data: any) {
    return this.request<any>(`/stores/${storeId}/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(storeId: string, categoryId: string) {
    return this.request<any>(`/stores/${storeId}/categories/${categoryId}`, {
      method: 'DELETE',
    })
  }

  // Orders
  async getOrders(storeId: string, params?: {
    page?: number
    limit?: number
    status?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.status) queryParams.set('status', params.status)

    const query = queryParams.toString()
    return this.request<any[]>(`/stores/${storeId}/orders${query ? `?${query}` : ''}`)
  }

  async getOrder(storeId: string, orderId: string) {
    return this.request<any>(`/stores/${storeId}/orders/${orderId}`)
  }

  async updateOrderStatus(storeId: string, orderId: string, status: string) {
    return this.request<any>(`/stores/${storeId}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatus: status }),
    })
  }

  // Customers
  async getCustomers(storeId: string, params?: {
    page?: number
    limit?: number
    search?: string
  }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)

    const query = queryParams.toString()
    return this.request<any[]>(`/stores/${storeId}/customers${query ? `?${query}` : ''}`)
  }

  async getCustomer(storeId: string, customerId: string) {
    return this.request<any>(`/stores/${storeId}/customers/${customerId}`)
  }

  // Stats
  async getStats(storeId: string) {
    return this.request<{
      stats: {
        totalSales: number
        totalOrders: number
        totalCustomers: number
        totalProducts: number
        activeProducts: number
      }
      recentOrders: any[]
      topProducts: any[]
    }>(`/stores/${storeId}/stats`)
  }
}

export const api = new ApiClient()
