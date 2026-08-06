export interface BookingWidgetConfig {
  organizationId: string
  experienceId?: string
  theme?: 'light' | 'dark'
  language?: 'en' | 'pl' | 'is'
  primaryColor?: string
  accentColor?: string
  onBookingComplete?: (bookingId: string) => void
  apiBaseUrl?: string
}

export interface Experience {
  id: string
  name: string
  description: string
  price: number
  currency: string
  duration: number
  maxParticipants: number
  availableSlots: DateSlot[]
}

export interface DateSlot {
  date: string
  time: string
  available: number
}

export interface Booking {
  id: string
  experienceId: string
  email: string
  phone: string
  participants: number
  startDate: string
  status: 'pending' | 'confirmed' | 'cancelled'
}
