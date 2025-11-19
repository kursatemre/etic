import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ETIC - Yeni Nesil E-Ticaret Altyapısı',
  description:
    'Modern, güçlü ve kullanımı kolay e-ticaret platformu. Mağazanızı dakikalar içinde kurun, satışlarınızı artırın.',
  keywords: 'e-ticaret, online mağaza, saas, shopify alternatif, ikas alternatif',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
