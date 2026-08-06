'use client'
import React from 'react'
import { Experience } from '../types'

interface ExperienceListProps {
  experiences: Experience[]
  onSelect: (experience: Experience) => void
}

export default function ExperienceList({ experiences, onSelect }: ExperienceListProps) {
  return (
    <div className="widget-experiences grid gap-4">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="p-4 border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition"
          onClick={() => onSelect(exp)}
        >
          <h3 className="font-bold text-lg">{exp.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-semibold text-emerald-600">${exp.price} {exp.currency}</span>
            <span className="text-sm text-gray-500">{exp.duration} min</span>
          </div>
        </div>
      ))}
    </div>
  )
}
