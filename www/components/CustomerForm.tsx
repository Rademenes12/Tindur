import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { customerSchema, CustomerFormData } from '@/lib/validation';
import { User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  initialData?: Partial<CustomerFormData>;
  translations: any;
}

export default function CustomerForm({
  onSubmit,
  initialData,
  translations,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData,
  });

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        {translations.customerInfo}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translations.firstName} *
          </label>
          <input
            {...register('firstName')}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {translations.lastName} *
          </label>
          <input
            {...register('lastName')}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Mail className="w-4 h-4 inline mr-1" />
          {translations.email} *
        </label>
        <input
          {...register('email')}
          type="email"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Phone className="w-4 h-4 inline mr-1" />
          {translations.phone} *
        </label>
        <input
          {...register('phone')}
          type="tel"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 234 567 8900"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="w-4 h-4 inline mr-1" />
          {translations.country} *
        </label>
        <select
          {...register('country')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select country</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="ES">Spain</option>
          <option value="IT">Italy</option>
          <option value="PL">Poland</option>
          <option value="IS">Iceland</option>
          <option value="NO">Norway</option>
          <option value="SE">Sweden</option>
          <option value="DK">Denmark</option>
        </select>
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          {translations.specialRequests}
        </label>
        <textarea
          {...register('specialRequests')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any special requirements or requests..."
        />
      </div>
    </motion.form>
  );
}