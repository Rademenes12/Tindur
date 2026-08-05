"use client";

import React, { useState } from 'eact';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Grid, List } from 'lucide-react';

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Calendar Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">May 2024</h2>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button className="p-2 hover:bg-gray-100 border-r"><ChevronLeft size={18} /></button>
            <button className="px-4 py-1 text-sm font-medium hover:bg-gray-100">Today</button>
            <button className="p-2 hover:bg-gray-100 border-l"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1 text-sm rounded-md capitalize ${view === v? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
            <Plus size={18} /> Add Block
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar Main View */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-7 border-t border-l">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500 border-b border-r">
                {day}
              </div>
            ))}
            {/* Mock Days */}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-32 border-b border-r p-2 hover:bg-gray-50 transition cursor-pointer">
                <span className="text-sm text-gray-400">{i + 1}</span>
                {i === 12 && (
                  <div className="mt-2 p-1 bg-red-100 text-red-700 text-[10px] font-bold rounded px-2">
                    Blocked: Kayaking
                  </div>
                )}
                {i === 15 && (
                  <div className="mt-2 p-1 bg-green-100 text-green-700 text-[10px] font-bold rounded px-2">
                    3 Bookings
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Legend */}
        <aside className="w-64 border-l bg-gray-50 p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Blocked</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>High Demand</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}