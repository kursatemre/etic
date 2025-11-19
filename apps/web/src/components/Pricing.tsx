'use client'

import { Check, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Başlangıç',
    price: '0',
    period: 'Ücretsiz',
    description: 'Yeni başlayanlar için ideal',
    features: [
      'Sınırsız ürün',
      '100 sipariş/ay',
      'Temel tema şablonları',
      'SSL sertifikası',
      'Email destek',
      'Mobil uygulama',
    ],
    cta: 'Ücretsiz Başla',
    featured: false,
  },
  {
    name: 'Profesyonel',
    price: '299',
    period: '/ay',
    description: 'Büyüyen işletmeler için',
    features: [
      'Sınırsız ürün',
      'Sınırsız sipariş',
      'Premium temalar',
      'SSL sertifikası',
      'Öncelikli destek',
      'Mobil uygulama',
      'Gelişmiş analitik',
      'Özel domain',
      'Kargo entegrasyonları',
    ],
    cta: 'Şimdi Başla',
    featured: true,
  },
  {
    name: 'Kurumsal',
    price: 'Özel',
    period: 'Teklif',
    description: 'Büyük ölçekli işletmeler',
    features: [
      'Profesyonel tüm özellikler',
      'Özel geliştirme',
      'Dedicated sunucu',
      'API erişimi',
      '7/24 telefon desteği',
      'Özel eğitim',
      'SLA garantisi',
      'Çoklu mağaza',
    ],
    cta: 'İletişime Geç',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Şeffaf <span className="text-gradient">Fiyatlandırma</span>
          </h2>
          <p className="text-xl text-gray-600">
            İşinize en uygun paketi seçin. Gizli maliyet yok, dilediğiniz zaman iptal edebilirsiniz.
          </p>
          {/* Discount Badge */}
          <div className="inline-flex items-center space-x-2 bg-secondary-100 border border-secondary-300 rounded-full px-4 py-2 mt-6">
            <Star className="w-4 h-4 text-secondary-600 fill-secondary-600" />
            <span className="text-sm font-medium text-secondary-900">
              İlk 3 ay %50 indirim + Ücretsiz migrasyon desteği
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-2xl scale-105 border-0'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1 rounded-full">
                  En Popüler
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}
                >
                  {plan.name}
                </h3>
                <p className={plan.featured ? 'text-primary-100' : 'text-gray-600'}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end">
                  <span
                    className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.price === 'Özel' ? plan.price : `₺${plan.price}`}
                  </span>
                  <span
                    className={`ml-2 mb-2 ${plan.featured ? 'text-primary-100' : 'text-gray-600'}`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check
                      className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                        plan.featured ? 'text-white' : 'text-primary-600'
                      }`}
                    />
                    <span className={plan.featured ? 'text-primary-50' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition ${
                  plan.featured
                    ? 'bg-white text-primary-600 hover:bg-gray-100'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <strong>30 gün para iade garantisi.</strong> Memnun kalmazsanız, sorulsuz sualsiz paranızı iade ediyoruz.
          </p>
        </div>
      </div>
    </section>
  )
}
