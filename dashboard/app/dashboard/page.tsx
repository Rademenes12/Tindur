"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Star, 
  ArrowUpRight, 
  Plus 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'echarts';

// Mockowe dane do wykresu
const data = [
  { name: '01', bookings: 12 },
  { name: '05', bookings: 19 },
  { name: '10', bookings: 15 },
  { name: '15', bookings: 22 },
  { name: '20', bookings: 30 },
  { name: '25', bookings: 25 },
  { name: '30', bookings: 35 },
];

const stats = [
  { label: "Rezerwacje (miesiąc)", value: "148", change: "+12%", icon: CalendarIcon, color: "text-blue-400" },
  { label: "Przychody", value: "42,500 ISK", change: "+5.4%", icon: TrendingUp, color: "text-green-400" },
  { label: "Średnia ocena", value: "4.8", change: "+0.2", icon: Star, color: "text-yellow-400" },
  { label: "Konwersja", value: "3.2%", change: "-1.1%", icon: ArrowUpRight, color: "text-purple-400" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Witaj, Tindur Admin 👋</h2>
          <p className="text-white/50">Oto co dzieje się w Twojej organizacji dzisiaj.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Sprawdź kalendarz</Button>
          <Button className="bg-blue-600 hover:bg-blue-500">
            <Plus className="mr-2 h-4 w-4" /> Dodaj wycieczkę
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                stat.change.startsWith('+')? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/50">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wykres */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Dynamika rezerwacji</h3>
            <p className="text-sm text-white/50">Liczba nowych rezerwacji w ciągu ostatnich 30 dni</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Ostatnie rezerwacje */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Ostatnie rezerwacje</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Klient #{i + 1024}</p>
                    <p className="text-xs text-white/40">Wycieczka: Blue Lagoon</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-400">Potwierdzona</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-white/40 hover:text-white">
            Zobacz wszystkie
          </Button>
        </Card>
      </div>
    </div>
  );
}