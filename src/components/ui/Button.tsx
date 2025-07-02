import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  children: React.ReactNode;
  focusable?: boolean;
  focusable?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon = undefined,
  loading = false,
  children,
  focusable = true,
  focusable = true,
  className = 'font-lexend',
  disabled,
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 
                      ${focusable ? 'focus:outline-none focus:ring-2 focus:ring-offset-2' : 'focus:outline-none'} 
                      disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]`;
                      ${focusable ? 'focus:outline-none focus:ring-2 focus:ring-offset-2' : 'focus:outline-none'} 
                      disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]`;

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md hover:shadow-lg active:bg-blue-800',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500 shadow-md hover:shadow-lg active:bg-slate-800',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500 active:bg-slate-200'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
      aria-busy={loading ? 'true' : 'false'}
      aria-busy={loading ? 'true' : 'false'}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
};
}