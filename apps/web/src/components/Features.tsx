'use client'

import {
  ShoppingCart,
  Globe,
  CreditCard,
  BarChart3,
  Smartphone,
  Lock,
  Zap,
  Users,
  Package,
} from 'lucide-react'

const features = [
  {
    icon: ShoppingCart,
    title: 'Sınırsız Ürün',
    description: 'İstediğiniz kadar ürün ekleyin, katalog sınırlaması yok.',
  },
  {
    icon: Globe,
    title: 'Çoklu Dil & Para Birimi',
    description: 'Global pazarlara ulaşın, dünya çapında satış yapın.',
  },
  {
    icon: CreditCard,
    title: 'Güvenli Ödeme',
    description: 'Tüm popüler ödeme yöntemleri ile entegre altyapı.',
  },
  {
    icon: BarChart3,
    title: 'Gelişmiş Analitik',
    description: 'Detaylı raporlar ile satışlarınızı takip edin.',
  },
  {
    icon: Smartphone,
    title: 'Mobil Uyumlu',
    description: 'Responsive tasarım ile her cihazda mükemmel görünüm.',
  },
  {
    icon: Lock,
    title: 'SSL Sertifikası',
    description: 'Ücretsiz SSL ile güvenli alışveriş deneyimi.',
  },
  {
    icon: Zap,
    title: 'Hızlı Performans',
    description: 'Optimize edilmiş altyapı ile yıldırım hızında sayfa yükleme.',
  },
  {
    icon: Users,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız, canlı destek ile yardım.',
  },
  {
    icon: Package,
    title: 'Kolay Kargo Entegrasyonu',
    description: 'Tüm kargo firmalarıyla otomatik entegrasyon.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            İhtiyacınız Olan <span className="text-gradient">Her Şey</span>
          </h2>
          <p className="text-xl text-gray-600">
            E-ticaret işinizi büyütmek için gereken tüm araçlar ve özellikler bir arada
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '10K+', label: 'Aktif Mağaza' },
            { value: '99.9%', label: 'Uptime' },
            { value: '50M+', label: 'Aylık Ziyaretçi' },
            { value: '₺1M+', label: 'Günlük İşlem' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
