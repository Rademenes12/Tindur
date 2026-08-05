export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface Experience {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  price_adult: number;
  price_child: number;
  currency: string;
  image_url?: string;
  max_participants: number;
  min_participants: number;
  category?: string;
}

export interface Availability {
  id: string;
  experience_id: string;
  date: string;
  time: string;
  available_spots: number;
  price_adult: number;
  price_child: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests?: string;
}

export interface BookingState {
  step: 'experience' | 'date' | 'guests' | 'customer' | 'payment' | 'summary' | 'confirmation';
  organization?: Organization;
  selectedExperience?: Experience;
  selectedAvailability?: Availability;
  adults: number;
  children: number;
  customer?: Customer;
  paymentMethod: 'stripe' | 'onsite';
  bookingId?: string;
  totalPrice: number;
}

export type BookingAction =
  | { type: 'SET_ORGANIZATION'; payload: Organization }
  | { type: 'SELECT_EXPERIENCE'; payload: Experience }
  | { type: 'SELECT_DATE'; payload: Availability }
  | { type: 'SET_GUESTS'; payload: { adults: number; children: number } }
  | { type: 'SET_CUSTOMER'; payload: Customer }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'stripe' | 'onsite' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: BookingState['step'] }
  | { type: 'SET_BOOKING_ID'; payload: string }
  | { type: 'CALCULATE_TOTAL' }
  | { type: 'RESET' };

export interface WidgetMessage {
  type: 'booking_started' | 'booking_completed' | 'booking_cancelled' | 'step_changed';
  data?: any;
}