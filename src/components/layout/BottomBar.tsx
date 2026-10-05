'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomBar() {
  const pathname = usePathname();

  // Hide on admin routes or access denied
  if (pathname.startsWith('/admin') || pathname === '/access-denied') {
    return null;
  }

  const items = [
    { label: 'होम', href: '/', icon: '🏠' },
    { label: 'खोजें', href: '/search', icon: '🔍' },
    { label: 'बुकमार्क', href: '/bookmarks', icon: '🔖' },
    { label: 'भेजें', href: '/submit-story', icon: '✍️' },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-[env(safe-area-inset-bottom)] shadow-lg"
    >
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-xs font-devanagari transition-colors ${
                isActive ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="text-base leading-none mb-0.5">{item.icon}</span>
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
