import { ReactNode, ButtonHTMLAttributes } from 'eact';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'econdary' | 'ghost' | 'danger';
  size?: 'm' | 'd' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'd',
  isLoading = false,
  leftIcon,
  disabled,
  ..props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    ghost: "bg-transparent text-white/70 hover:bg-white/5 hover:text-white",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
}