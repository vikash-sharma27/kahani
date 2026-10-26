import React from 'react';
import Link from 'next/link';
import { Badge18Plus } from '@/components/ui/Badge18Plus';
import { formatDate } from '@/lib/utils';

export interface StoryCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  publishedAt: Date | string | null;
  readingTimeMin: number;
  likeCount: number;
  commentCount: number;
  category: {
    name: string;
    slug: string;
    colour?: string;
  };
}

export function StoryCard({ story }: { story: StoryCardData }) {
  const colourMap: Record<string, { border: string; bg: string; text: string }> = {
    rose: { border: 'border-l-[#b8233e]', bg: 'bg-rose-50/80', text: 'text-[#b8233e]' },
    amber: { border: 'border-l-amber-500', bg: 'bg-amber-50/80', text: 'text-amber-700' },
    blue: { border: 'border-l-sky-600', bg: 'bg-sky-50/80', text: 'text-sky-700' },
    purple: { border: 'border-l-purple-600', bg: 'bg-purple-50/80', text: 'text-purple-700' },
    indigo: { border: 'border-l-indigo-600', bg: 'bg-indigo-50/80', text: 'text-indigo-700' },
    emerald: { border: 'border-l-emerald-600', bg: 'bg-emerald-50/80', text: 'text-emerald-700' },
  };

  const style = colourMap[story.category.colour || ''] || colourMap.rose;

  return (
    <article className={`card-3d ${style.border} border-l-4 p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden`}>
      {/* Subtle top romantic gradient sheen */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/40 via-transparent to-transparent pointer-events-none rounded-tr-lg" />

      <div>
        {/* Story Title - 3D Clickable Headline with high readability */}
        <h2 className="text-base sm:text-lg font-bold text-[#1b1517] group-hover:text-[#b8233e] transition-colors font-devanagari leading-snug mb-2.5">
          <Link href={`/story/${story.slug}`} className="focus:outline-none focus:underline">
            {story.title}
          </Link>
        </h2>

        {/* Metadata row with author, category, date, and 18+ tag */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] text-gray-500 mb-3 font-devanagari">
          <span className={`font-bold ${style.bg} ${style.text} px-2.5 py-0.5 rounded-full border border-rose-200/60 shadow-2xs`}>
            {story.category.name}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-700 font-medium">✍️ {story.authorName}</span>
          <span className="text-gray-300">•</span>
          <time className="text-gray-400">
            {formatDate(story.publishedAt || new Date())}
          </time>
          <span className="text-gray-300">•</span>
          <Badge18Plus size="sm" />
        </div>

        {/* 2-line story excerpt text */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-devanagari mb-4">
          {story.excerpt}
        </p>
      </div>

      {/* Footer bar with reading stats and 3D Read More button */}
      <div className="pt-3 border-t border-rose-100/80 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-medium">
          <span className="bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md">
            ⏱️ {story.readingTimeMin} min read
          </span>
          <span className="bg-rose-50/70 border border-rose-100 px-2 py-0.5 rounded-md text-rose-700">
            ❤️ {story.likeCount}
          </span>
          <span className="bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md">
            💬 {story.commentCount}
          </span>
        </div>

        <Link
          href={`/story/${story.slug}`}
          className="btn-3d inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#b8233e] to-[#91152a] hover:from-[#cb2846] hover:to-[#a21931] px-3.5 py-1.5 rounded-lg shadow-sm font-devanagari tracking-wide"
        >
          <span>कहानी पढ़ें</span>
          <span className="text-[10px]">»</span>
        </Link>
      </div>
    </article>
  );
}
