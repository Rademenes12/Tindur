'use client'

import { useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    demo: 'Umów demo',
    start: 'Zacznij za darmo',
  },
  en: {
    demo: 'Book demo',
    start: 'Start for free',
  },
}

export default function Navbar() {
  const [lang, setLang] = useState<Language>('pl')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = translations[lang]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-ice flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Tindur</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
              className="px-3 py-1 rounded-lg glass glass-hover text-sm font-medium"
            >
              {lang === 'pl' ? '🇬🇧 EN' : '🇵🇱 PL'}
            </button>
            <a
              href="#demo"
              className="px-4 py-2 rounded-lg glass glass-hover text-sm font-medium"
            >
              {t.demo}
            </a>
            <a
              href="#pricing"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-ice text-white font-medium hover:opacity-90 transition-opacity"
            >
              {t.start}
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <button
              onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
              className="w-full px-4 py-2 rounded-lg glass glass-hover text-sm font-medium"
            >
              {lang === 'pl' ? '🇬🇧 EN' : '🇵🇱 PL'}
            </button>
            <a
              href="#demo"
              className="block w-full px-4 py-2 rounded-lg glass glass-hover text-sm font-medium text-center"
            >
              {t.demo}
            </a>
            <a
              href="#pricing"
              className="block w-full px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-ice text-white font-medium text-center"
            >
              {t.start}
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}