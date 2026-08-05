'use client'

import { useEffect, useRef, useState } from 'react'

type Language = 'pl' | 'en'

const translations = {
  pl: {
    title: 'Co mówią nasi klienci',
    subtitle: 'Dołącz do setek zadowolonych touroperatorów',
    testimonials: [
      {
        quote: 'Tindur zwiększył nasze rezerwacje o 40% w 3 miesiące',
        author: 'Anna Jónsdóttir',
        company: 'Reykjavik Adventures',
        avatar: '👩‍💼',
      },
      {
        quote: 'Najlepsza platforma dla islandzkich touroperatorów',
        author: 'Erik Magnússon',
        company: 'Glacier Tours',
        avatar: '👨‍💼',
      },
      {
        quote: 'Setup w 10 minut, płatności działają od razu',
        author: 'Magnus Þórsson',
        company: 'Northern Lights Co',
        avatar: '🧑‍💼',
      },
    ],
  },
  en: {
    title: 'What our clients say',
    subtitle: 'Join hundreds of satisfied tour operators',
    testimonials: [
      {
        quote: 'Tindur increased our bookings by 40% in 3 months',
        author: 'Anna Jónsdóttir',
        company: 'Reykjavik Adventures',
        avatar: '👩‍💼',
      },
      {
        quote: 'The best platform for Icelandic tour operators',
        author: 'Erik Magnússon',
        company: 'Glacier Tours',
        avatar: '👨‍💼',
      },
      {
        quote: 'Setup in 10 minutes, payments work immediately',
        author: 'Magnus Þórsson',
        company: 'Northern Lights Co',
        avatar: '🧑‍💼',
      },
    ],
  },
}

export default function Testimonials() {
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
    <section className="section-padding bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.testimonials.map((testimonial, index) => (
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
              <div className="mb-6">
                <svg
                  className="w-10 h-10 text-ice opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center">
                <div className="text-4xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}