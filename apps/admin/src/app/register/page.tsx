'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Kayıt başarısız')
      }

      // Store token
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">ETIC Admin</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Hesap Oluştur</h2>
          <p className="mt-2 text-gray-600">E-ticaret mağazanızı yönetin</p>
        </div>

        {/* Register Form */}
        <div className="card">
          <div className="card-body">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Ad Soyad
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input"
                  placeholder="Adınız Soyadınız"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="label">
                  E-posta
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input"
                  placeholder="En az 8 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Şifre Tekrar
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                    Kullanım Koşulları
                  </Link>{' '}
                  ve{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </label>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kaydediliyor...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Kayıt Ol
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
