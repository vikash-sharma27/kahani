'use client';

import React, { useState } from 'react';
import { Badge18Plus } from '@/components/ui/Badge18Plus';
import { ReaderControls } from '@/components/story/ReaderControls';

interface StoryReaderProps {
  title: string;
  authorName: string;
  content: string;
  readingTimeMin: number;
  categoryName: string;
}

type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';

const FONT_SIZES: Record<FontSize, string> = {
  sm: 'prose-sm',
  base: 'prose-base',
  lg: 'prose-lg',
  xl: 'prose-xl',
  '2xl': 'prose-2xl',
};

export function StoryReader({
  title,
  authorName,
  content,
  readingTimeMin,
  categoryName,
}: StoryReaderProps) {
  const [fontSize, setFontSize] = useState<FontSize>('base');

  return (
    <div className="relative">
      {/* Story Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3 font-devanagari">
          <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {categoryName}
          </span>
          <span>•</span>
          <span>लेखक: {authorName}</span>
          <span>•</span>
          <span>⏱️ {readingTimeMin} मिनट</span>
          <Badge18Plus size="md" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight font-devanagari mb-2">
          {title}
        </h1>

        {/* Fictional disclaimer inline */}
        <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold px-2.5 py-1 rounded-full mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Fictional Content | 18+ Adults Only | सभी पात्र काल्पनिक
        </div>
      </div>

      {/* Story Body */}
      <article
        className={`prose max-w-none ${FONT_SIZES[fontSize]} leading-loose font-devanagari text-gray-800
          prose-p:mb-4 prose-headings:font-bold prose-headings:text-gray-900
          prose-strong:text-gray-900 prose-blockquote:border-l-red-400 prose-blockquote:bg-red-50/30 prose-blockquote:px-4 prose-blockquote:py-1
          prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
        `}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Font size floating controls */}
      <ReaderControls onFontSizeChange={(s) => setFontSize(s as FontSize)} />
    </div>
  );
}
