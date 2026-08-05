'use client'

import { useEffect, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    title: 'Platforma bookingowa dla Islandii',
    subtitle:
      'Wszystko czego potrzebujesz do prowadzenia wycieczek na Islandii. Widget rezerwacji, płatności, panel organizatora - w jednym miejscu.',
    cta1: 'Zacznij za darmo',
    cta2: 'Umów demo',
    stats: [
      { value: '500+', label: 'Touroperatorów' },
      { value: '50k+', label: 'Rezerwacji' },
      { value: '99.9%', label: 'Uptime' },
    ],
  },
  en: {
    title: 'Booking Platform for Iceland',
    subtitle:
      'Everything you need to run tours in Iceland. Booking widget, payments, operator panel - all in one place.',
    cta1: 'Start for free',
    cta2: 'Book demo',
    stats: [
      { value: '500+', label: 'Tour Operators' },
      { value: '50k+', label: 'Bookings' },
      { value: '99.9%', label: 'Uptime' },
    ],
  },
}

export default function Hero() {
  const [lang, setLang] = useState<Language>('pl')

  useEffect(() => {
    const handleLangChange = () => {
      const currentLang = document.documentElement.lang as Language
      setLang(currentLang)
    }
    handleLangChange()
  }, [])

  const t = translations[lang]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-ice/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ice/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container-custom relative z-10 text-center section-padding">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="gradient-text">Tindur</span>
          <br />
          <span className="text-3xl md:text-5xl text-gray-300">
            {t.title}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-slide-up">
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
          <a
            href="#pricing"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-ice text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            {t.cta1}
          </a>
          <a
            href="#demo"
            className="px-8 py-4 rounded-lg glass glass-hover font-semibold text-lg"
          >
            {t.cta2}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-xl p-6 glass-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}