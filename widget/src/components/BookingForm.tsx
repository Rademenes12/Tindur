'use client'
import React, { useState } from 'react'
import { Booking } from '../types'

interface BookingFormProps {
  experienceId: string
  onSubmit: (booking: Partial<Booking>) => Promise<void>
  isLoading?: boolean
}

export default function BookingForm({ experienceId, onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    participants: 1,
    startDate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await onSubmit({
        ...formData,
        experienceId,
        status: 'pending'
      })
      setSuccess(true)
      setFormData({ email: '', phone: '', participants: 1, startDate: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    }
  }

  if (success) {
    return (
      <div className="widget-success p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-bold text-green-900">✅ Booking Confirmed!</h3>
        <p className="text-sm text-green-700">Check your email for confirmation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="widget-form space-y-4 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Participants</label>
        <select
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-500 text-white font-semibold py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
      >
        {isLoading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  )
}
