import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Calendar, Download } from 'lucide-react';
import { BookingState } from '@/lib/types';

interface BookingConfirmationProps {
  booking: BookingState;
  translations: any;
}

export default function BookingConfirmation({
  booking,
  translations,
}: BookingConfirmationProps) {
  const { bookingId, customer, selectedExperience } = booking;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">
          {translations.bookingConfirmed}
        </h2>
        <p className="text-green-100">{translations.thankYou}</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-600 mb-2">
            {translations.bookingReference}
          </div>
          <div className="text-3xl font-bold text-blue-600 tracking-wider">
            {bookingId?.toUpperCase().slice(0, 8)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Confirmation Email
              </div>
              <div className="text-sm text-gray-600">
                {translations.confirmationEmail} {customer?.email}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 mb-1">
                Add to Calendar
              </div>
              <div className="text-sm text-gray-600">
                Download your booking details and add to your calendar
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Check your email for booking confirmation and details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>
                You will receive a reminder 24 hours before your experience
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>
                Arrive 15 minutes early at the meeting point
              </span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Book Another
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}