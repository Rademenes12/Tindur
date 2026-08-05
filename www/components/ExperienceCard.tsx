import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/lib/types';
import { Clock, Users } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
  onSelect: () => void;
  currency: string;
}

export default function ExperienceCard({
  experience,
  onSelect,
  currency,
}: ExperienceCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer border border-gray-200 hover:border-blue-400 transition-all"
      onClick={onSelect}
    >
      {experience.image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {experience.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(experience.duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>
              {experience.min_participants}-{experience.max_participants}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              {currency} {experience.price_adult}
            </span>
            <span className="text-sm text-gray-500 ml-1">/ adult</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Select
          </button>
        </div>
      </div>
    </motion.div>
  );
}