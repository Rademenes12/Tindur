import { BookingState, BookingAction } from './types';

export const initialState: BookingState = {
  step: 'experience',
  adults: 2,
  children: 0,
  paymentMethod: 'stripe',
  totalPrice: 0,
};

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case 'SET_ORGANIZATION':
      return { ...state, organization: action.payload };

    case 'SELECT_EXPERIENCE':
      return {
        ...state,
        selectedExperience: action.payload,
        step: 'date',
      };

    case 'SELECT_DATE':
      return {
        ...state,
        selectedAvailability: action.payload,
        step: 'guests',
      };

    case 'SET_GUESTS':
      return {
        ...state,
        adults: action.payload.adults,
        children: action.payload.children,
      };

    case 'SET_CUSTOMER':
      return {
        ...state,
        customer: action.payload,
      };

    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case 'NEXT_STEP':
      const steps: BookingState['step'][] = [
        'experience',
        'date',
        'guests',
        'customer',
        'payment',
        'summary',
        'confirmation',
      ];
      const currentIndex = steps.indexOf(state.step);
      const nextStep = steps[Math.min(currentIndex + 1, steps.length - 1)];
      return { ...state, step: nextStep };

    case 'PREV_STEP':
      const stepsBack: BookingState['step'][] = [
        'experience',
        'date',
        'guests',
        'customer',
        'payment',
        'summary',
        'confirmation',
      ];
      const currentIndexBack = stepsBack.indexOf(state.step);
      const prevStep = stepsBack[Math.max(currentIndexBack - 1, 0)];
      return { ...state, step: prevStep };

    case 'GO_TO_STEP':
      return { ...state, step: action.payload };

    case 'SET_BOOKING_ID':
      return { ...state, bookingId: action.payload };

    case 'CALCULATE_TOTAL':
      if (!state.selectedAvailability) return state;
      const total =
        state.adults * state.selectedAvailability.price_adult +
        state.children * state.selectedAvailability.price_child;
      return { ...state, totalPrice: total };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}