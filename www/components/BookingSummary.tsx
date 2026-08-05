import React from 'react';
import { motion } from 'framer-motion';
import { BookingState } from '@/lib/types';
import { Calendar, Clock, Users, MapPin, Mail, Phone } from 'lucide-react';

interface BookingSummaryProps {
  booking: BookingState;
  translations: any;
}

export default function BookingSummary({
  booking,
  translations,
}: BookingSummaryProps) {
  const { selectedExperience, selectedAvailability, adults, children, customer, totalPrice } = booking;

  if (!selectedExperience || !selectedAvailability || !customer) {
    return null;
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} ${translations.minutes}`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${translations.hours}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{translations.summary}</h2>
        <p className="text-blue-100">Please review your booking details</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Experience Details */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-medium text-lg text-gray-900 mb-2">
              {selectedExperience.title}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(selectedExperience.duration_minutes)}
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Date & Time</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              {formatDate(selectedAvailability.date)}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              {selectedAvailability.time}
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Guests</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">
                {adults} {translations.adults}
              </span>
              <span className="font-medium">
                {selectedExperience.currency} {adults * selectedAvailability.price_adult}
              </span>
            </div>
            {children > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {children} {translations.children}
                </span>
                <span className="font-medium">
                  {selectedExperience.currency} {children * selectedAvailability.price_child}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4" />
              {customer.firstName} {customer.lastName}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" />
              {customer.email}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              {customer.phone}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" />
              {customer.country}
            </div>
          </div>
        </div>

        {customer.specialRequests && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Special Requests</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{customer.specialRequests}</p>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900">
              {translations.total}
            </span>
            <span className="text-3xl font-bold text-blue-600">
              {selectedExperience.currency} {totalPrice}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}