import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5 overflow-x-auto whitespace-nowrap text-xs text-gray-500">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <span className="text-gray-300">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-900 transition-colors font-devanagari">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium font-devanagari" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
