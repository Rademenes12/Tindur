import { Search, Bell, Plus, Command } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Breadcrumbs / Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Szukaj (Cmd + K)" 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Command className="h-3 w-3 text-white/20" />
              <span className="text-[10px] text-white/20">K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative text-white/60 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </Button>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <Button className="hidden md:flex bg-blue-600 hover:bg-blue-500">
            <Plus className="mr-2 h-4 w-4" /> Nowa wycieczka
          </Button>
        </div>
      </div>
    </header>
  );
}