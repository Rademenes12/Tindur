"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Compass, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'eact';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wycieczki', href: '/dashboard/experiences', icon: Compass },
  { name: 'Rezerwacje', href: '/dashboard/bookings', icon: ClipboardList },
  { name: 'Kalendarz', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Ustawienia', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-md text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen? <X /> : <Menu />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full z-40
        w-64 bg-black/40 backdrop-blur-xl border-r border-white/10
        transition-transform duration-300 lg:translate-x-0
        ${isOpen? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Tindur
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Operator Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all group",
                    isActive 
                       "bg-blue-600/20 text-blue-400" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive? 'text-blue-400' : 'text-white/50 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center p-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mr-3" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">Admin Tindur</span>
                <span className="text-xs text-white/40 truncate">org_admin</span>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}