import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Availability } from '@/lib/types';
import { getAvailability } from '@/lib/api';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  experienceId: string;
  onSelectDate: (availability: Availability) => void;
  locale: string;
}

export default function DatePicker({
  experienceId,
  onSelectDate,
  locale,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [currentMonth, experienceId]);

  const loadAvailability = async () => {
    setLoading(true);
    const startDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).toISOString().split('T')[0];
    const endDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).toISOString().split('T')[0];

    const data = await getAvailability(experienceId, startDate, endDate);
    setAvailability(data);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAvailabilityForDate = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];
    return availability.filter((a) => a.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    ).toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const handleTimeSelect = (avail: Availability) => {
    onSelectDate(avail);
  };

  const days = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {monthName}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} />;
            }

            const dateAvailability = getAvailabilityForDate(day);
            const hasAvailability = dateAvailability.length > 0;
            const dateStr = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            ).toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <motion.button
                key={day}
                whileHover={hasAvailability && !isPast ? { scale: 1.05 } : {}}
                whileTap={hasAvailability && !isPast ? { scale: 0.95 } : {}}
                onClick={() => hasAvailability && !isPast && handleDateSelect(day)}
                disabled={!hasAvailability || isPast}
                className={`
                  aspect-square rounded-lg p-2 text-sm font-medium transition-all
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${hasAvailability && !isPast && !isSelected ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : ''}
                  ${!hasAvailability || isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <h4 className="text-sm font-semibold mb-3">Available Times</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availability
              .filter((a) => a.date === selectedDate)
              .map((avail) => (
                <motion.button
                  key={avail.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTimeSelect(avail)}
                  className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <div className="font-medium">{avail.time}</div>
                  <div className="text-xs opacity-75">
                    {avail.available_spots} spots
                  </div>
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}