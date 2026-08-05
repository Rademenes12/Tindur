import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Check } from 'lucide-react';

interface PaymentSelectorProps {
  selectedMethod: 'stripe' | 'onsite';
  onSelectMethod: (method: 'stripe' | 'onsite') => void;
  translations: any;
}

export default function PaymentSelector({
  selectedMethod,
  onSelectMethod,
  translations,
}: PaymentSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        {translations.payment}
      </h3>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMethod('stripe')}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'stripe'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === 'stripe'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {translations.payNow}
                </div>
                <div className="text-sm text-gray-500">
                  Pay securely with card
                </div>
              </div>
            </div>
            {selectedMethod === 'stripe' && (
              <Check className="w-6 h-6 text-blue-600" />
            )}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMethod('onsite')}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'onsite'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedMethod === 'onsite'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {translations.payOnSite}
                </div>
                <div className="text-sm text-gray-500">
                  Pay when you arrive
                </div>
              </div>
            </div>
            {selectedMethod === 'onsite' && (
              <Check className="w-6 h-6 text-blue-600" />
            )}
          </div>
        </motion.button>
      </div>

      {selectedMethod === 'stripe' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-blue-50 rounded-lg"
        >
          <p className="text-sm text-blue-900">
            You will be redirected to Stripe's secure payment page to complete
            your booking.
          </p>
        </motion.div>
      )}
    </div>
  );
}