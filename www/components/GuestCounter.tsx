import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Users } from 'lucide-react';

interface GuestCounterProps {
  adults: number;
  children: number;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  maxGuests?: number;
  adultPrice: number;
  childPrice: number;
  currency: string;
  translations: any;
}

export default function GuestCounter({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  maxGuests = 20,
  adultPrice,
  childPrice,
  currency,
  translations,
}: GuestCounterProps) {
  const totalGuests = adults + children;

  const handleIncrement = (type: 'adults' | 'children') => {
    if (totalGuests >= maxGuests) return;
    if (type === 'adults') {
      onAdultsChange(adults + 1);
    } else {
      onChildrenChange(children + 1);
    }
  };

  const handleDecrement = (type: 'adults' | 'children') => {
    if (type === 'adults' && adults > 0) {
      onAdultsChange(adults - 1);
    } else if (type === 'children' && children > 0) {
      onChildrenChange(children - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">{translations.selectGuests}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">{translations.adults}</div>
            <div className="text-sm text-gray-500">
              {currency} {adultPrice} {translations.perPerson}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDecrement('adults')}
              disabled={adults === 0}
              className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center font-semibold text-lg">
              {adults}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleIncrement('adults')}
              disabled={totalGuests >= maxGuests}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">
              {translations.children}
            </div>
            <div className="text-sm text-gray-500">
              {currency} {childPrice} {translations.perPerson}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDecrement('children')}
              disabled={children === 0}
              className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center font-semibold text-lg">
              {children}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleIncrement('children')}
              disabled={totalGuests >= maxGuests}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Guests:</span>
          <span className="text-xl font-bold text-gray-900">{totalGuests}</span>
        </div>
        {totalGuests >= maxGuests && (
          <p className="text-sm text-amber-600 mt-2">
            Maximum number of guests reached
          </p>
        )}
      </div>
    </div>
  );
}