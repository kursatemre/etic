'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">ETIC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">
              Özellikler
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">
              Fiyatlandırma
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">
              Referanslar
            </Link>
            <Link
              href="/docs"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Dokümantasyon
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition font-medium"
            >
              Giriş Yap
            </Link>
            <Link href="/register" className="btn-primary">
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Özellikler
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Fiyatlandırma
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Referanslar
              </Link>
              <Link
                href="/docs"
                className="text-gray-600 hover:text-gray-900 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dokümantasyon
              </Link>
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link href="/login" className="btn-secondary">
                  Giriş Yap
                </Link>
                <Link href="/register" className="btn-primary">
                  Ücretsiz Başla
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
