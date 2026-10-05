'use client';

import React, { useState } from 'react';

interface ReaderControlsProps {
  onFontSizeChange: (size: 'sm' | 'base' | 'lg' | 'xl' | '2xl') => void;
}

export function ReaderControls({ onFontSizeChange }: ReaderControlsProps) {
  const sizes: Array<'sm' | 'base' | 'lg' | 'xl' | '2xl'> = ['sm', 'base', 'lg', 'xl', '2xl'];
  const [currentIdx, setCurrentIdx] = useState(1); // default 'base'

  const decrease = () => {
    if (currentIdx > 0) {
      const next = currentIdx - 1;
      setCurrentIdx(next);
      onFontSizeChange(sizes[next]);
    }
  };

  const increase = () => {
    if (currentIdx < sizes.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      onFontSizeChange(sizes[next]);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="फॉन्ट आकार नियंत्रक (Font size controls)"
      className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-30 bg-white/95 backdrop-blur shadow-lg border border-gray-200 rounded-full px-3 py-1.5 flex items-center gap-2 select-none"
    >
      <button
        type="button"
        onClick={decrease}
        disabled={currentIdx === 0}
        aria-label="छोटा फॉन्ट"
        className="min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none text-sm"
      >
        A-
      </button>

      <span className="text-xs font-mono font-medium text-gray-400">|</span>

      <button
        type="button"
        onClick={increase}
        disabled={currentIdx === sizes.length - 1}
        aria-label="बड़ा फॉन्ट"
        className="min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none text-base"
      >
        A+
      </button>
    </div>
  );
}
