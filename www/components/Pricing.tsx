'use client'

import { useEffect, useRef, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    title: 'Proste i przejrzyste ceny',
    subtitle: 'Wybierz plan dopasowany do Twojego biznesu',
    monthly: '/miesiąc',
    cta: 'Rozpocznij',
    plans: [
      {
        name: 'Free',
        price: '0',
        description: 'Dla małych operatorów',
        features: [
          'Do 10 rezerwacji/miesiąc',
          '1 administrator',
          'Wsparcie email',
          'Widget rezerwacji',
          'Panel podstawowy',
        ],
        highlighted: false,
      },
      {
        name: 'Starter',
        price: '99',
        description: 'Dla rozwijających się firm',
        features: [
          'Do 100 rezerwacji/miesiąc',
          'Multi-admin',
          'Custom domain',
          '3% take rate',
          'Wsparcie priorytetowe',
          'Analityka zaawansowana',
        ],
        highlighted: true,
      },
      {
        name: 'Pro',
        price: '299',
        description: 'Dla dużych operatorów',
        features: [
          'Do 1000 rezerwacji/miesiąc',
          'White-label',
          'API dostęp',
          '2% take rate',
          'Dedykowany account manager',
          'Custom integracje',
        ],
        highlighted: false,
      },
    ],
  },
  en: {
    title: 'Simple and transparent pricing',
    subtitle: 'Choose a plan tailored to your business',
    monthly: '/month',
    cta: 'Get started',
    plans: [
      {
        name: 'Free',
        price: '0',
        description: 'For small operators',
        features: [
          'Up to 10 bookings/month',
          '1 administrator',
          'Email support',
          'Booking widget',
          'Basic panel',
        ],
        highlighted: false,
      },
      {
        name: 'Starter',
        price: '99',
        description: 'For growing businesses',
        features: [
          'Up to 100 bookings/month',
          'Multi-admin',
          'Custom domain',
          '3% take rate',
          'Priority support',
          'Advanced analytics',
        ],
        highlighted: true,
      },
      {
        name: 'Pro',
        price: '299',
        description: 'For large operators',
        features: [
          'Up to 1000 bookings/month',
          'White-label',
          'API access',
          '2% take rate',
          'Dedicated account manager',
          'Custom integrations',
        ],
        highlighted: false,
      },
    ],
  },
}

export default function Pricing() {
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
    <section id="pricing" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={`glass rounded-2xl p-8 glass-hover transition-all duration-500 ${
                plan.highlighted
                  ? 'ring-2 ring-primary scale-105 md:scale-110'
                  : ''
              } ${
                visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-ice text-white text-sm font-semibold">
                    {lang === 'pl' ? 'Najpopularniejszy' : 'Most Popular'}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2 text-white">
                {plan.name}
              </h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold gradient-text">
                  €{plan.price}
                </span>
                <span className="text-gray-400">{t.monthly}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-ice mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#demo"
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-primary to-ice text-white hover:opacity-90'
                    : 'glass glass-hover'
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}