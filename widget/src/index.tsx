'use client'
import React, { useEffect, useState } from 'react'
import { BookingWidgetConfig, Experience, Booking } from './types'
import BookingForm from './components/BookingForm'
import ExperienceList from './components/ExperienceList'
import { fetchExperiences, createBooking } from './utils/api'
import './styles/widget.css'

export default function TindurBookingWidget(config: BookingWidgetConfig) {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [selected, setSelected] = useState<Experience | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const apiUrl = config.apiBaseUrl || 'https://api.tindur.is/v1'

  useEffect(() => {
    const load = async () => {
      try {
        const exps = await fetchExperiences(config.organizationId, apiUrl)
        setExperiences(exps)
      } catch (err) {
        setError('Failed to load experiences')
      }
    }
    load()
  }, [config.organizationId, apiUrl])

  const handleBooking = async (booking: Partial<Booking>) => {
    setIsLoading(true)
    try {
      const result = await createBooking(booking, apiUrl)
      config.onBookingComplete?.(result.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="tindur-widget" data-theme={config.theme || 'light'}>
      <style>{`
        :root { --widget-primary: ${config.primaryColor || '#10b981'}; }
      `}</style>

      <div className="widget-container max-w-2xl mx-auto">
        {error && <div className="error-banner p-4 bg-red-50 text-red-700 rounded mb-4">{error}</div>}

        {!selected ? (
          <>
            <h2 className="widget-title text-2xl font-bold mb-6">Book Your Experience</h2>
            <ExperienceList experiences={experiences} onSelect={setSelected} />
          </>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className="mb-4 text-sm text-emerald-600 hover:underline"
            >
              ← Back to experiences
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <p className="text-gray-600 mt-2">{selected.description}</p>
            </div>
            <BookingForm
              experienceId={selected.id}
              onSubmit={handleBooking}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  )
}
