'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const [val, setVal] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = val.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="यहाँ कहानी, श्रेणी या लेखक का नाम खोजें..."
          className="w-full pl-9 pr-3.5 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#b8233e] focus:ring-1 focus:ring-[#b8233e] font-devanagari bg-gray-50/60"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      </div>
      <button
        type="submit"
        className="bg-[#b8233e] hover:bg-[#981b31] active:bg-[#7f1124] text-white px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors font-devanagari shrink-0 shadow-xs"
      >
        खोजें
      </button>
    </form>
  );
}
