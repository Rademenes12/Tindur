'use client'

import { useEffect, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    product: 'Produkt',
    features: 'Funkcje',
    pricing: 'Cennik',
    demo: 'Demo',
    company: 'Firma',
    about: 'O nas',
    contact: 'Kontakt',
    terms: 'Regulamin',
    privacy: 'Prywatność',
    social: 'Social Media',
    rights: '© 2024 Tindur. Wszystkie prawa zastrzeżone.',
  },
  en: {
    product: 'Product',
    features: 'Features',
    pricing: 'Pricing',
    demo: 'Demo',
    company: 'Company',
    about: 'About',
    contact: 'Contact',
    terms: 'Terms',
    privacy: 'Privacy',
    social: 'Social Media',
    rights: '© 2024 Tindur. All rights reserved.',
  },
}

export default function Footer() {
  const [lang, setLang] = useState<Language>('pl')

  useEffect(() => {
    const currentLang = document.documentElement.lang as Language
    setLang(currentLang || 'pl')
  }, [])

  const t = translations[lang]

  return (
    <footer className="border-t border-white/10 bg-gray-900/50">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-ice flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Tindur</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {lang === 'pl'
                ? 'Platforma bookingowa B2B dla touroperatorów na Islandii'
                : 'B2B booking platform for tour operators in Iceland'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.product}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.features}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.pricing}
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.demo}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.company}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.about}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@tindur.is"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.contact}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.terms}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-ice transition-colors"
                >
                  {t.privacy}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.social}</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/tindur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass glass-hover flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/tindur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass glass-hover flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://facebook.com/tindur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass glass-hover flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          {t.rights}
        </div>
      </div>
    </footer>
  )
}