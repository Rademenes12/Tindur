'use client'

import { useEffect, useRef, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    title: 'Wszystko czego potrzebujesz',
    subtitle: 'Kompleksowe rozwiązanie dla touroperatorów',
    features: [
      {
        icon: '🎨',
        title: 'Widget rezerwacji',
        description: 'Embedowalny widget na Twojej stronie. Pełna personalizacja kolorów i stylu.',
      },
      {
        icon: '💳',
        title: 'Płatności Stripe',
        description: 'Automatyczny split payments z operatorami. Bezpieczne i szybkie transakcje.',
      },
      {
        icon: '📊',
        title: 'Panel organizatora',
        description: 'Zarządzaj wycieczkami, cenami i dostępnością w jednym miejscu.',
      },
      {
        icon: '📱',
        title: 'Aplikacja dla przewodników',
        description: 'Check-in uczestników, dodawanie zdjęć i raportowanie w czasie rzeczywistym.',
      },
      {
        icon: '📈',
        title: 'Analityka w czasie rzeczywistym',
        description: 'Dashboard z metrykami sprzedaży, konwersji i przychodów.',
      },
      {
        icon: '🇮🇸',
        title: 'Wsparcie 24/7 po islandzku',
        description: 'Nasz zespół jest dostępny całą dobę w języku islandzkim i angielskim.',
      },
    ],
  },
  en: {
    title: 'Everything you need',
    subtitle: 'Complete solution for tour operators',
    features: [
      {
        icon: '🎨',
        title: 'Booking Widget',
        description: 'Embeddable widget for your website. Full color and style customization.',
      },
      {
        icon: '💳',
        title: 'Stripe Payments',
        description: 'Automatic split payments with operators. Secure and fast transactions.',
      },
      {
        icon: '📊',
        title: 'Operator Panel',
        description: 'Manage tours, pricing and availability in one place.',
      },
      {
        icon: '📱',
        title: 'Guide App',
        description: 'Check-in participants, add photos and report in real-time.',
      },
      {
        icon: '📈',
        title: 'Real-time Analytics',
        description: 'Dashboard with sales, conversion and revenue metrics.',
      },
      {
        icon: '🇮🇸',
        title: '24/7 Support in Icelandic',
        description: 'Our team is available 24/7 in Icelandic and English.',
      },
    ],
  },
}

export default function Features() {
  const [lang, setLang] = useState<Language>('pl')
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const currentLang = document.documentElement.lang as Language
    setLang(currentLang || 'pl')
  }, [])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index))
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const t = translations[lang]

  return (
    <section id="features" className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={`glass rounded-2xl p-8 glass-hover transition-all duration-500 ${
                visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}