'use client'

import Link from 'next/link'
import { ArrowRight, Play, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
            <span className="text-sm font-medium text-primary-900">
              Türkiye'nin En İyi E-Ticaret Altyapısı
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            <span className="text-gray-900">E-Ticarete</span>
            <br />
            <span className="text-gradient">Yeni Başlangıç</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Modern, güçlü ve kullanımı kolay e-ticaret platformu ile mağazanızı dakikalar
            içinde kurun. Sınırsız ürün, sınırsız ziyaretçi, sınırsız başarı.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
            <Link href="/register" className="btn-primary text-lg w-full sm:w-auto">
              Ücretsiz Başla
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="btn-secondary text-lg w-full sm:w-auto group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition" />
              Demo İzle
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600 animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white"
                  ></div>
                ))}
              </div>
              <span>
                <strong className="text-gray-900">10,000+</strong> mutlu kullanıcı
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2">
                <strong className="text-gray-900">4.9/5</strong> (424 değerlendirme)
              </span>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="mt-16 relative animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 aspect-video flex items-center justify-center">
                <div className="text-gray-400 text-lg">Dashboard Preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
