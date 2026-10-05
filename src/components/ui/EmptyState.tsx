import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title = 'कोई कहानी नहीं मिली',
  description = 'फिलहाल इस श्रेणी या पृष्ठ में कोई कहानी उपलब्ध नहीं है।',
  actionText = 'मुख्य पृष्ठ पर जाएँ',
  actionHref = '/',
}: EmptyStateProps) {
  return (
    <div className="w-full text-center py-16 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
        📖
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 font-devanagari">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 font-devanagari">
        {description}
      </p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center min-h-[44px] px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors font-devanagari"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'कुछ गड़बड़ हो गई',
  message = 'पेज लोड करने में समस्या आई है। कृपया पुनः प्रयास करें।',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full text-center py-12 px-4 bg-red-50/50 rounded-xl border border-red-200">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
        !
      </div>
      <h3 className="text-lg font-bold text-red-900 mb-1 font-devanagari">
        {title}
      </h3>
      <p className="text-sm text-red-700 max-w-sm mx-auto mb-5 font-devanagari">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-[44px] px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors font-devanagari"
        >
          पुनः प्रयास करें (Retry)
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
