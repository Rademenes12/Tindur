'use client'

import { useEffect, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    title: 'Gotowy na start?',
    subtitle:
      'Dołącz do setek touroperatorów, którzy już korzystają z Tindur',
    cta1: 'Zacznij za darmo',
    cta2: 'Umów demo',
  },
  en: {
    title: 'Ready to start?',
    subtitle:
      'Join hundreds of tour operators already using Tindur',
    cta1: 'Start for free',
    cta2: 'Book demo',
  },
}

export default function CTA() {
  const [lang, setLang] = useState<Language>('pl')

  useEffect(() => {
    const currentLang = document.documentElement.lang as Language
    setLang(currentLang || 'pl')
  }, [])

  const t = translations[lang]

  return (
    <section id="demo" className="section-padding">
      <div className="container-custom">
        <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-ice/20" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {t.title}
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#pricing"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-ice text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                {t.cta1}
              </a>
              <a
                href="mailto:hello@tindur.is"
                className="px-8 py-4 rounded-lg glass glass-hover font-semibold text-lg"
              >
                {t.cta2}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}