"use client";

import React, { useState } from 'eact';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar'; // do rozszerzeń
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// // Typy
type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'available' | 'booked' | 'blocked';
  details?: any;
}

export function CalendarView() {
  const [view, setView] = useState<ViewType>('dayGridMonth');
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Available Slot', start: '2024-05-20T10:00:00', end: '2024-05-20T12:00:00', status: 'available' },
    { id: '2', title: 'Reserved: Jón', start: '2024-05-20T14:00:00', end: '2024-05-20T16:00:00', status: 'booked' },
    { id: '3', title: 'Maintenance', start: '2024-05-21T08:00:00', end: '2024-05-21T18:00:00', status: 'blocked' },
  ]);

  // // Obsługa zdarzeń
  const handleDateSelect = (selectInfo: any) => {
    const title = window.prompt('Nowa rezerwacja (wpisz nazwę):');
    if (title) {
      const newEvent: CalendarEvent = {
        id: Math.random().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        status: 'available'
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    alert(`Szczegóły: ${clickInfo.event.title}\nStatus: ${clickInfo.event.extendedProps.status}`);
  };

  const handleEventDrop = (info: any) => {
    console.log("Przesunięto event:", info.event.id);
    // Tutaj logika aktualizacji w Supabase
  };

  // // Mapowanie kolorów statusów
  const eventClassNames = (arg: any) => {
    const status = arg.event.extendedProps.status;
    if (status === 'available') return 'bg-green-500 border-none';
    if (status === 'booked') return 'bg-blue-500 border-none';
    return 'bg-gray-400 border-none';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Kalendarz dostępności</h2>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => setView('dayGridMonth')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'dayGridMonth'? 'bg-white dark:bg-zinc-700 shadow' : ''}`}
            >
              Miesiąc
            </button>
            <button 
              onClick={() => setView('timeGridWeek')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'timeGridWeek'? 'bg-white dark:bg-zinc-700 shadow' : ''}`}
            >
              Tydzień
            </button>
            <button 
              onClick={() => setView('timeGridDay')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'timeGridDay'? 'bg-white dark:bg-zinc-700 shadow' : ''}`}
            >
              Dzień
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Dostępne</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Zarezerwowane</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded-full"></span> Zablokowane</div>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          view="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={events.map(e => ({
            ..e,
            className: eventClassNames({ event: e })
          }))}
          locale="pl" // Można dynamicznie zmieniać
          height="700px"
        />
      </div>
    </div>
  );
}