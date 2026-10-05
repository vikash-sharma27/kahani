import React from 'react';

interface Badge18PlusProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge18Plus({ className = '', size = 'sm' }: Badge18PlusProps) {
  const sizeStyles =
    size === 'sm'
      ? 'text-[11px] px-1.5 py-0.5 font-bold'
      : 'text-xs px-2.5 py-1 font-bold';

  return (
    <span
      className={`inline-flex items-center justify-center rounded border border-red-300 bg-red-50 text-red-700 tracking-wider select-none ${sizeStyles} ${className}`}
      title="18+ Adult Content Only"
    >
      18+
    </span>
  );
}
