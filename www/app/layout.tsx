import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'Tindur - Platforma bookingowa dla touroperatorów na Islandii',
  description: 'Wszystko czego potrzebujesz do prowadzenia wycieczek na Islandii. Widget rezerwacji, płatności, panel organizatora - w jednym miejscu.',
  keywords: 'booking, Iceland, tour operator, rezerwacje, Islandia, wycieczki',
  authors: [{ name: 'Tindur' }],
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    alternateLocale: 'en_US',
    url: 'https://tindur.is',
    siteName: 'Tindur',
    title: 'Tindur - Platforma bookingowa dla touroperatorów na Islandii',
    description: 'Wszystko czego potrzebujesz do prowadzenia wycieczek na Islandii. Widget rezerwacji, płatności, panel organizatora - w jednym miejscu.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tindur Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tindur - Platforma bookingowa dla touroperatorów na Islandii',
    description: 'Wszystko czego potrzebujesz do prowadzenia wycieczek na Islandii.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Tindur',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '0',
                highPrice: '299',
                priceCurrency: 'EUR',
              },
              operatingSystem: 'Web',
              description: 'Platforma bookingowa B2B dla touroperatorów na Islandii',
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}