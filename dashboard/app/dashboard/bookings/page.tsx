import React from 'eact';
import { Filter, Search, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { StatsCard } from '@/components/stats-card'; // Assuming this exists

// Mock Data
const bookings = [
  { id: 'BK-001', customer: 'Adam Nowak', experience: 'Sunset Kayaking', date: '2024-05-20', status: 'confirmed', amount: '250 PLN' },
  { id: 'BK-002', customer: 'Ewa Kowalska', experience: 'Mountain Hike', date: '2024-05-21', status: 'pending', amount: '180 PLN' },
  { id: 'BK-003', customer: 'Marek Wis', experience: 'City Tour', date: '2024-05-22', status: 'confirmed', amount: '120 PLN' },
];

export default async function BookingsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Pending" value="12" change="+2" color="text-orange-600" />
        <StatsCard title="Confirmed" value="148" change="+12" color="text-green-600" />
        <StatsCard title="Today" value="5" change="0" color="text-blue-600" />
        <StatsCard title="Total (Month)" value="1,240" change="+15%" color="text-indigo-600" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" placeholder="Search customer..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter size={16} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <CalendarIcon size={16} /> Date
          </button>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          Export CSV
        </button>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-sm">{booking.id}</td>
                <td className="px-6 py-4 text-sm">{booking.customer}</td>
                <td className="px-6 py-4 text-sm">{booking.experience}</td>
                <td className="px-6 py-4 text-sm">{booking.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    booking.status === 'confirmed'? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">{booking.amount}</td>
                <td className="px-6 py-4 text-gray-400">
                  <button><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State (Conditional) */}
        {bookings.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">No bookings found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or create a new experience.</p>
            <button className="text-indigo-600 font-semibold">Create Experience</button>
          </div>
        )}
      </div>
    </div>
  );
}