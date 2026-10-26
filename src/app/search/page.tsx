import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { StoryCard } from '@/components/story/StoryCard';
import Link from 'next/link';
import { db } from '@/lib/db';

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = (searchParams?.q || '').trim();
  const title = query ? `"${query}" के लिए खोज परिणाम | Chut Ki Kahani` : 'कहानी खोजें (Search Stories) | Chut Ki Kahani';

  return {
    title,
    description: 'Chut Ki Kahani पर अपनी पसंदीदा हिंदी एवं हिंग्लिश कहानियाँ खोजें।',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q || '').trim();
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const perPage = 10;
  const skip = (page - 1) * perPage;

  let stories: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    authorName: string;
    publishedAt: Date | null;
    readingTimeMin: number;
    likeCount: number;
    commentCount: number;
    category: { name: string; slug: string; colour: string | null };
  }> = [];
  let total = 0;
  let totalPages = 0;

  if (query.length >= 2) {
    const where = {
      status: 'PUBLISHED' as const,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
        { authorName: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    [total, stories] = await Promise.all([
      db.story.count({ where }),
      db.story.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          authorName: true,
          publishedAt: true,
          readingTimeMin: true,
          likeCount: true,
          commentCount: true,
          category: { select: { name: true, slug: true, colour: true } },
        },
      }),
    ]);
    totalPages = Math.max(1, Math.ceil(total / perPage));
  }

  return (
    <Container className="py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <main className="space-y-4">
          {/* Results Header */}
          <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 px-4 py-3.5 shadow-2xs">
            {query.length >= 2 ? (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-[#1e1b1c] font-devanagari flex items-center gap-2">
                    <span>🔍</span>
                    <span>
                      &ldquo;<span className="text-[#b8233e]">{query}</span>&rdquo; के लिए खोज परिणाम
                    </span>
                  </h1>
                  <p className="text-[11px] text-gray-500 font-devanagari mt-0.5">
                    {total === 0
                      ? 'कोई कहानी नहीं मिली'
                      : `${total} कहानियाँ मिलीं — पृष्ठ ${page} / ${totalPages}`}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-rose-50 text-[#b8233e] border border-rose-100 px-2.5 py-1 rounded-md">
                  कुल: {total}
                </span>
              </div>
            ) : (
              <h1 className="text-base sm:text-lg font-bold text-[#1e1b1c] font-devanagari flex items-center gap-2">
                <span>🔍</span>
                <span>कहानी खोजें</span>
              </h1>
            )}
          </div>

          {/* Results or Prompt */}
          {query.length < 2 ? (
            <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 p-10 text-center text-gray-500 font-devanagari text-sm shadow-2xs">
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-semibold text-gray-700 mb-1">ऊपर दिए search box में खोजें</p>
              <p className="text-xs text-gray-400">कम से कम 2 अक्षर लिखें — शीर्षक, लेखक या विषय से खोज सकते हैं</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 p-10 text-center text-gray-500 font-devanagari shadow-2xs">
              <p className="text-3xl mb-3">😕</p>
              <p className="font-semibold text-gray-700 mb-1">कोई कहानी नहीं मिली</p>
              <p className="text-xs text-gray-400 mb-4">
                &ldquo;{query}&rdquo; से संबंधित कोई कहानी नहीं मिली। कृपया दूसरे शब्दों से खोजें।
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2 bg-[#b8233e] text-white font-bold rounded-lg text-sm hover:bg-[#981b31] transition-colors"
              >
                सभी कहानियाँ देखें →
              </Link>
            </div>
          ) : (
            <>
              {/* Story Cards */}
              <div className="space-y-3.5">
                {stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={{
                      id: story.id,
                      title: story.title,
                      slug: story.slug,
                      excerpt: story.excerpt,
                      authorName: story.authorName,
                      publishedAt: story.publishedAt,
                      readingTimeMin: story.readingTimeMin,
                      likeCount: story.likeCount,
                      commentCount: story.commentCount,
                      category: {
                        name: story.category.name,
                        slug: story.category.slug,
                        colour: story.category.colour ?? undefined,
                      },
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 p-3 shadow-2xs flex gap-2 justify-center text-xs">
                  {page > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                      className="btn-3d px-4 py-2 border border-gray-200 bg-white rounded-lg font-bold text-gray-700 hover:bg-rose-50 hover:text-[#b8233e] flex items-center gap-1"
                    >
                      ← पिछला
                    </Link>
                  )}
                  <span className="px-4 py-2 bg-rose-50 text-[#b8233e] border border-rose-100 rounded-lg flex items-center font-mono font-bold">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                      className="btn-3d px-4 py-2 border border-gray-200 bg-white rounded-lg font-bold text-gray-700 hover:bg-rose-50 hover:text-[#b8233e] flex items-center gap-1"
                    >
                      अगला →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        <Sidebar />
      </div>
    </Container>
  );
}
