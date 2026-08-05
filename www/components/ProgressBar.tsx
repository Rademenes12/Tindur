import React from 'react';
import { motion } from 'framer-motion';
import { BookingState } from '@/lib/types';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: BookingState['step'];
  translations: any;
}

export default function ProgressBar({ currentStep, translations }: ProgressBarProps) {
  const steps: { key: BookingState['step']; label: string }[] = [
    { key: 'experience', label: translations.selectExperience },
    { key: 'date', label: translations.selectDate },
    { key: 'guests', label: translations.selectGuests },
    { key: 'customer', label: translations.customerInfo },
    { key: 'payment', label: translations.payment },
    { key: 'summary', label: translations.summary },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? '#3b82f6'
                      : '#e5e7eb',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mb-2"
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-xs text-center hidden sm:block ${
                    isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200 rounded">
                  <motion.div
                    initial={false}
                    animate={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-green-500 rounded"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}