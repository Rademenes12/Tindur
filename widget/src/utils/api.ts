import { Booking, Experience } from '../types'

export async function fetchExperiences(orgId: string, apiUrl: string): Promise<Experience[]> {
  const res = await fetch(`${apiUrl}/organizations/${orgId}/experiences`)
  if (!res.ok) throw new Error('Failed to fetch experiences')
  return res.json()
}

export async function createBooking(booking: Partial<Booking>, apiUrl: string): Promise<Booking> {
  const res = await fetch(`${apiUrl}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
  if (!res.ok) throw new Error('Failed to create booking')
  return res.json()
}

export async function fetchAvailability(experienceId: string, apiUrl: string) {
  const res = await fetch(`${apiUrl}/experiences/${experienceId}/availability`)
  if (!res.ok) throw new Error('Failed to fetch availability')
  return res.json()
}
