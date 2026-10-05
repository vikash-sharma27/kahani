import React from 'react';
import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('w-full max-w-[1100px] mx-auto px-4 sm:px-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
