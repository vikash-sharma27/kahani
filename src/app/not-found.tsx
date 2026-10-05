import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-4xl font-extrabold text-red-600 mb-2">404</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2 font-devanagari">
          पृष्ठ नहीं मिला (Page Not Found)
        </h1>
        <p className="text-sm text-gray-600 mb-6 font-devanagari">
          आप जिस पृष्ठ या कहानी की तलाश कर रहे हैं वह हटा दी गई है या उपलब्ध नहीं है।
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors"
        >
          ← मुख्य पृष्ठ पर वापस जाएँ
        </Link>
      </div>
    </div>
  );
}
