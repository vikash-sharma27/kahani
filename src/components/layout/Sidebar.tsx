import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

// Cache categories for 10 minutes to eliminate DB latency on every request
const getCachedCategories = unstable_cache(
  async () => {
    return db.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { stories: { where: { status: 'PUBLISHED' } } },
        },
      },
    });
  },
  ['sidebar-categories'],
  { revalidate: 600 }
);

// Cache popular stories for 10 minutes
const getCachedPopularStories = unstable_cache(
  async () => {
    return db.story.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        category: {
          select: { name: true, slug: true },
        },
      },
    });
  },
  ['sidebar-popular-stories'],
  { revalidate: 600 }
);

export async function Sidebar() {
  let categories: Array<{ id: string; name: string; slug: string; _count: { stories: number } }> = [];
  let popularStories: Array<{ id: string; title: string; slug: string; viewCount: number; category: { name: string; slug: string } }> = [];

  try {
    [categories, popularStories] = await Promise.all([
      getCachedCategories(),
      getCachedPopularStories(),
    ]);
  } catch (err) {
    console.error('Sidebar data fetch error:', err);
  }

  return (
    <aside className="w-full space-y-5">
      {/* Categories Widget (Clean Simple Card) */}
      <div className="bg-white rounded-xl border border-rose-100 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#b8233e] to-[#91152a] text-white px-4 py-2.5 font-bold text-xs sm:text-sm font-devanagari flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>📚</span>
            <span>कहानियों की श्रेणियां</span>
          </span>
          <Link href="/categories" className="text-[11px] text-rose-100 hover:text-white font-normal underline">
            सभी देखें
          </Link>
        </div>
        <ul className="divide-y divide-rose-50/60 text-xs sm:text-sm">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-rose-50/60 hover:text-[#b8233e] transition-colors group font-devanagari"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#b8233e] text-xs font-bold">›</span>
                  <span className="group-hover:translate-x-0.5 transition-transform font-medium">{cat.name}</span>
                </span>
                <span className="text-[10px] text-rose-800 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full font-mono font-bold">
                  {cat._count.stories}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Stories Widget (Clean Simple Card) */}
      <div className="bg-white rounded-xl border border-rose-100 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#201a24] to-[#322336] text-white px-4 py-2.5 font-bold text-xs sm:text-sm font-devanagari flex items-center gap-2">
          <span>🔥</span>
          <span>लोकप्रिय कहानियाँ (Popular)</span>
        </div>
        <div className="divide-y divide-rose-50/60 p-2">
          {popularStories.map((story, idx) => (
            <div key={story.id} className="py-2.5 px-2 hover:bg-rose-50/40 rounded-lg transition-colors">
              <Link
                href={`/story/${story.slug}`}
                className="text-xs font-bold text-gray-800 hover:text-[#b8233e] font-devanagari line-clamp-2 block leading-snug mb-1"
              >
                <span className="text-[#b8233e] font-mono mr-1.5">{idx + 1}.</span>
                {story.title}
              </Link>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="text-rose-800 bg-rose-50/80 border border-rose-100 px-1.5 py-0.5 rounded font-devanagari font-medium">
                  {story.category.name}
                </span>
                <span>•</span>
                <span>👁️ {story.viewCount} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Story CTA Widget (3D Card) */}
      <div className="bg-gradient-to-br from-[#b8233e] via-[#a31a32] to-[#7f1124] text-white rounded-xl p-5 text-center shadow-md border-b-4 border-b-[#5c0b19]">
        <span className="text-3xl block mb-1 drop-shadow-sm">✍️</span>
        <h3 className="font-bold text-sm sm:text-base mb-1 font-devanagari">अपनी कहानी भेजें</h3>
        <p className="text-xs text-rose-100/90 mb-3.5 font-devanagari leading-relaxed">
          क्या आप भी एक लेखक हैं? अपनी मौलिक रचना लाखों पाठकों तक पहुँचाएँ।
        </p>
        <Link
          href="/submit-story"
          className="btn-3d inline-block w-full py-2 bg-white text-[#b8233e] hover:bg-rose-50 font-bold text-xs rounded-lg shadow-sm transition-colors font-devanagari tracking-wide"
        >
          यहाँ कहानी सबमिट करें →
        </Link>
      </div>

      {/* 18+ Disclaimer Widget */}
      <div className="bg-white/80 rounded-xl border border-rose-200/80 p-3.5 text-center text-xs text-gray-600 shadow-2xs">
        <div className="inline-block bg-rose-100 text-[#b8233e] text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-1.5">
          18+ केवल वयस्क
        </div>
        <p className="text-[11px] leading-relaxed font-devanagari text-gray-500">
          इस वेबसाइट की सभी सामग्री केवल वयस्क पाठकों (18+) के मनोरंजन हेतु है। सभी पात्र पूर्णतः काल्पनिक हैं।
        </p>
      </div>
    </aside>
  );
}
