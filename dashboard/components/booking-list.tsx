"use client";

import React, { useState, useMemo } from 'eact';
import { 
  Search, Filter, Download, Mail, Check, X, MoreVertical, 
  ChevronDown, ArrowUpDown, Calendar as CalendarIcon 
} from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Booking {
  id: string;
  customer_email: string;
  customer_name: string;
  experience_title: string;
  date: string;
  status: BookingStatus;
  amount_isk: number;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
};

export function BookingList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; dir: 'asc' | 'desc' } | null>(null);

  // Mock Data
  const bookings: Booking[] = [
    { id: '1', customer_email: 'jan@example.is', customer_name: 'Jón Jónsson', experience_title: 'Golden Circle Tour', date: '2024-05-20', status: 'confirmed', amount_isk: 45000 },
    { id: '2', customer_email: 'anna@example.com', customer_name: 'Anna Smith', experience_title: 'South Coast Hike', date: '2024-05-21', status: 'pending', amount_isk: 32000 },
    { id: '3', customer_email: 'test@test.com', customer_name: 'Test User', experience_title: 'Ice Cave Exploration', date: '2024-05-22', status: 'cancelled', amount_isk: 55000 },
  ];

  // // Sortowanie i Filtrowanie
  const filteredBookings = useMemo(() => {
    return bookings
      filter(b => (statusFilter === 'all' || b.status === statusFilter))
      filter(b => b.customer_email.toLowerCase().includes(searchQuery.toLowerCase()))
      sort((a, b) => {
        if (!sortConfig) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.dir === 'asc'? -1 : 1;
        if (aVal > bVal) return sortConfig.dir === 'asc'? 1 : -1;
        return 0;
      });
  }, [searchQuery, statusFilter, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBookings.length) setSelectedIds([]);
    else setSelectedIds(filteredBookings.map(b => b.id));
  };

  return (
    <div className="space-y-4">
      {/* // Filtry i Wyszukiwanie */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Szukaj po emailu..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-zinc-950"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="p-2 border rounded-lg dark:bg-zinc-950 text-sm"
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Wszystkie statusy</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-zinc-50">
            <CalendarIcon size={16} />
            Data zakresu
          </button>

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">
            <Download size={16} />
            Eksportuj CSV
          </button>
        </div>
      </div>

      {/* // Tabela */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4 w-4">
                <input 
                  type="checkbox" 
                  className="rounded border-zinc-300"
                  checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 cursor-pointer hover:text-zinc-900" onClick={() => setSortConfig({ key: 'customer_name', dir: 'asc' })}>
                Klient <ArrowUpDown size={12} className="inline" />
              </th>
              <th className="p-4">Wycieczka</th>
              <th className="p-4 cursor-pointer hover:text-zinc-900" onClick={() => setSortConfig({ key: 'date', dir: 'asc' })}>
                Data <ArrowUpDown size={12} className="inline" />
              </th>
              <th className="p-4">Status</th>
              <th className="p-4">Kwota (ISK)</th>
              <th className="p-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-300"
                    checked={selectedIds.includes(booking.id)}
                    onChange={() => {
                      setSelectedIds(prev => prev.includes(booking.id)? prev.filter(id => id!== booking.id) : [...prev, booking.id]);
                    }}
                  />
                </td>
                <td className="p-4">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{booking.customer_name}</div>
                  <div className="text-xs text-zinc-500">{booking.customer_email}</div>
                </td>
                <td className="p-4 text-sm">{booking.experience_title}</td>
                <td className="p-4 text-sm">{new Date(booking.date).toLocaleDateString('pl-PL')}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[booking.status]}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium">{booking.amount_isk.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button title="Kontakt" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500">
                      <Mail size={16} />
                    </button>
                    <button title="Szczegóły" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}