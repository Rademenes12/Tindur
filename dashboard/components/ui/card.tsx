import { ReactNode } from 'eact';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Komponent Glassmorphism Card
 * Wykorzystuje Tailwind v4 do efektów blur i przezroczystości
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, className, header, footer }: CardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
        "shadow-xl transition-all duration-300 hover:border-white/20",
        className
      )}
    >
      {header && (
        <div className="px-6 py-4 border-b border-white/10 font-semibold text-white/90">
          {header}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          {footer}
        </div>
      )}
    </div>
  );
}