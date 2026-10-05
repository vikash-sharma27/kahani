import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none min-h-[44px] min-w-[44px] text-base';

    const variants = {
      primary: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm active:bg-red-800',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-400 active:bg-gray-300',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300',
      ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-200',
      danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 focus:ring-red-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm min-h-[44px]',
      md: 'px-4 py-2.5 text-base min-h-[44px]',
      lg: 'px-6 py-3.5 text-lg min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
