import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { StoryCard } from '@/components/story/StoryCard';
import { SearchForm } from '@/components/search/SearchForm';
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
    description: 'Chut Ki Kahani पर अपनी पसंदीदा हिंदी कहानियाँ खोजें।',
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
  let matchingCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    colour: string;
    _count: { stories: number };
  }> = [];
  let total = 0;
  let totalPages = 0;

  if (query.length >= 1) {
    const storyWhere = {
      status: 'PUBLISHED' as const,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
        { authorName: { contains: query, mode: 'insensitive' as const } },
        { content: { contains: query, mode: 'insensitive' as const } },
        { category: { name: { contains: query, mode: 'insensitive' as const } } },
        { category: { slug: { contains: query, mode: 'insensitive' as const } } },
      ],
    };

    const categoryWhere = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { slug: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    [matchingCategories, total, stories] = await Promise.all([
      db.category.findMany({
        where: categoryWhere,
        include: {
          _count: {
            select: { stories: { where: { status: 'PUBLISHED' } } },
          },
        },
      }),
      db.story.count({ where: storyWhere }),
      db.story.findMany({
        where: storyWhere,
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

  const hasAnyResults = matchingCategories.length > 0 || stories.length > 0;

  return (
    <Container className="py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <main className="space-y-5">
          {/* Prominent Search Bar (Interactive Client Form with zero mobile reload glitch) */}
          <div className="bg-white rounded-xl border border-rose-100 p-3 sm:p-4 shadow-xs">
            <SearchForm initialQuery={query} />
          </div>

          {/* Results Header */}
          <div className="bg-white rounded-xl border border-rose-100 px-4 py-3 shadow-xs">
            {query.length >= 1 ? (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-[#1e1b1c] font-devanagari flex items-center gap-2">
                    <span>🔍</span>
                    <span>
                      &ldquo;<span className="text-[#b8233e]">{query}</span>&rdquo; के लिए खोज परिणाम
                    </span>
                  </h1>
                  <p className="text-[11px] text-gray-500 font-devanagari mt-0.5">
                    {!hasAnyResults
                      ? 'कोई परिणाम नहीं मिला'
                      : `${stories.length} कहानियाँ, ${matchingCategories.length} श्रेणियां मिलीं`}
                  </p>
                </div>
                {hasAnyResults && (
                  <span className="text-xs font-mono font-bold bg-rose-50 text-[#b8233e] border border-rose-100 px-2.5 py-1 rounded-md">
                    कहानियाँ: {total} | श्रेणियां: {matchingCategories.length}
                  </span>
                )}
              </div>
            ) : (
              <h1 className="text-base sm:text-lg font-bold text-[#1e1b1c] font-devanagari flex items-center gap-2">
                <span>🔍</span>
                <span>कहानी या श्रेणी खोजें</span>
              </h1>
            )}
          </div>

          {/* Prompt when no query entered */}
          {query.length < 1 ? (
            <div className="bg-white rounded-xl border border-rose-100 p-8 text-center text-gray-500 font-devanagari text-sm shadow-xs">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-semibold text-gray-700 mb-1">खोजने के लिए ऊपर बॉक्स में टाइप करें</p>
              <p className="text-xs text-gray-400">शीर्षक, श्रेणी, लेखक या कहानी के किसी भी शब्द से खोजें</p>
            </div>
          ) : !hasAnyResults ? (
            /* No results found */
            <div className="bg-white rounded-xl border border-rose-100 p-8 text-center text-gray-500 font-devanagari shadow-xs">
              <p className="text-3xl mb-2">😕</p>
              <p className="font-semibold text-gray-700 mb-1">कोई परिणाम नहीं मिला</p>
              <p className="text-xs text-gray-400 mb-4">
                &ldquo;{query}&rdquo; से संबंधित कोई कहानी या श्रेणी नहीं मिली। कृपया दूसरे शब्दों से खोजें।
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2 bg-[#b8233e] text-white font-bold rounded-lg text-sm hover:bg-[#981b31] transition-colors"
              >
                सभी कहानियाँ देखें →
              </Link>
            </div>
          ) : (
            /* Results found */
            <div className="space-y-6">
              {/* Matching Categories Section */}
              {matchingCategories.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 font-devanagari flex items-center gap-2">
                      <span>📚</span>
                      <span>श्रेणियाँ (Categories)</span>
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-[#b8233e] border border-rose-100">
                      {matchingCategories.length} श्रेणी
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {matchingCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="card-3d border-l-4 border-l-[#b8233e] p-4 group flex flex-col justify-between hover:border-l-[#981b31]"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-bold text-base text-gray-900 group-hover:text-[#b8233e] transition-colors font-devanagari">
                              {cat.name}
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#b8233e] border border-rose-200">
                              {cat._count.stories === 1 ? '1 कहानी' : `${cat._count.stories} कहानियाँ`}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 font-devanagari leading-relaxed">
                            {cat.description || `${cat.name} श्रेणी की सभी लोकप्रिय कहानियाँ पढ़ें।`}
                          </p>
                        </div>

                        <div className="mt-3.5 pt-2 border-t border-rose-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 font-devanagari">श्रेणी खोलें</span>
                          <span className="text-xs font-bold text-[#b8233e] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-devanagari">
                            <span>कहानियाँ देखें</span>
                            <span>»</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Matching Stories Section */}
              {stories.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900 font-devanagari flex items-center gap-2">
                      <span>📖</span>
                      <span>कहानियाँ (Stories)</span>
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-[#b8233e] border border-rose-100">
                      {total} कुल
                    </span>
                  </div>

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
                    <div className="bg-white rounded-xl border border-rose-100 p-3 shadow-xs flex gap-2 justify-center text-xs">
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
                </section>
              )}
            </div>
          )}
        </main>

        <Sidebar />
      </div>
    </Container>
  );
}
