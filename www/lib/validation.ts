import { z } from 'zod';

export const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  country: z.string().min(2, 'Please select a country'),
  specialRequests: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;