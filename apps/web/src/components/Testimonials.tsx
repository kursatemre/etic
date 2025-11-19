'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Ayşe Yılmaz',
    role: 'Kurucusu',
    company: 'ModaButik.com',
    image: '',
    rating: 5,
    text: 'ETIC sayesinde e-ticaret sitemizi 2 saatte kurduk. Kullanımı çok kolay ve destek ekibi harika. İlk ayda satışlarımız %200 arttı!',
  },
  {
    name: 'Mehmet Demir',
    role: 'E-Ticaret Müdürü',
    company: 'TeknoMağaza',
    image: '',
    rating: 5,
    text: 'Shopify\'dan ETIC\'e geçiş yaptık. Hem daha uygun fiyatlı hem de Türkiye pazarına özel özellikleri var. Migrasyon süreci çok kolay oldu.',
  },
  {
    name: 'Zeynep Kaya',
    role: 'Girişimci',
    company: 'OrganikDünya',
    image: '',
    rating: 5,
    text: 'Kodlama bilgim olmadan profesyonel bir mağaza kurdum. Müşteri desteği 7/24 yanımda. ETIC ile işimi büyütmeye devam ediyorum.',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Müşterilerimiz <span className="text-gradient">Ne Diyor?</span>
          </h2>
          <p className="text-xl text-gray-600">
            Binlerce mağaza ETIC ile başarıya ulaşıyor
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-shadow"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400"></div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos Section */}
        <div className="mt-20">
          <p className="text-center text-gray-600 mb-8">
            <strong>10,000+</strong> marka ETIC'i tercih ediyor
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500 font-semibold">LOGO {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
