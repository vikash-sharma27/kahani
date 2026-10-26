import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { StoryCard } from '@/components/story/StoryCard';
import { Pagination } from '@/components/ui/Pagination';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Sidebar } from '@/components/layout/Sidebar';
import { STORIES_PER_PAGE } from '@/config/constants';
import { StoryStatus } from '@prisma/client';

export const revalidate = 180;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateStaticParams() {
  try {
    const categories = await db.category.findMany({
      select: { slug: true },
      take: 50,
    });
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    select: { name: true, slug: true, seoTitle: true, seoDescription: true, description: true },
  });

  if (!category) return { title: 'Category Not Found' };

  const title = category.seoTitle || `${category.name} कहानियाँ (Stories in Hindi) | Chut Ki Kahani`;
  const description =
    category.seoDescription ||
    category.description ||
    `Chut Ki Kahani पर पढ़ें ${category.name} की सर्वश्रेष्ठ मौलिक हिंदी एवं हिंग्लिश 18+ वयस्क कहानियाँ।`;

  const canonicalUrl = `${baseUrl}/category/${category.slug}`;

  return {
    title,
    description,
    keywords: [
      `${category.name} कहानियाँ`,
      `${category.name} stories in hindi`,
      `${category.name} adult stories`,
      'हिंदी कहानियाँ',
      'adult fiction hindi',
      'desikahani',
      'Chut Ki Kahani',
    ],
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Chut Ki Kahani',
      locale: 'hi_IN',
      type: 'website',
      images: [{ url: `${baseUrl}/logo.png`, width: 600, height: 200, alt: `${category.name} Stories` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo.png`],
    },
    other: {
      rating: 'adult',
      'RTA-5042-1996-1400-1577-RTA': 'RTA-5042-1996-1400-1577-RTA',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, slug: true, description: true },
  });

  if (!category) notFound();

  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const skip = (page - 1) * STORIES_PER_PAGE;

  // Ultra-fast query: Only fetch necessary metadata fields, no heavy content text
  const [total, stories] = await Promise.all([
    db.story.count({
      where: { categoryId: category.id, status: StoryStatus.PUBLISHED },
    }),
    db.story.findMany({
      where: { categoryId: category.id, status: StoryStatus.PUBLISHED },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: STORIES_PER_PAGE,
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
        category: {
          select: {
            name: true,
            slug: true,
            colour: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / STORIES_PER_PAGE));
  const categoryUrl = `${baseUrl}/category/${category.slug}`;

  // Rich JSON-LD Graph for Google Search: Breadcrumb + Collection + ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'श्रेणियाँ',
            item: `${baseUrl}/categories`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: categoryUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `${category.name} कहानियाँ | Chut Ki Kahani`,
        url: categoryUrl,
        description: category.description || `${category.name} कहानियाँ`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: stories.map((s, index) => ({
            '@type': 'ListItem',
            position: skip + index + 1,
            name: s.title,
            url: `${baseUrl}/story/${s.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <Container className="py-4 md:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-3">
        <Breadcrumbs
          items={[
            { label: 'श्रेणियाँ', href: '/categories' },
            { label: category.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Category Story Feed */}
        <main className="space-y-4">
          {/* Category Banner Title Box with simple border */}
          <div className="bg-white rounded-xl border border-rose-100 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e1b1c] font-devanagari flex items-center gap-2">
                  <span>📚</span>
                  <span>{category.name} कहानियाँ</span>
                </h1>
                {category.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-devanagari leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
              <span className="text-xs font-mono font-bold bg-rose-50 text-[#b8233e] border border-rose-200 px-3 py-1.5 rounded-lg shadow-2xs">
                {total} कहानियाँ
              </span>
            </div>
          </div>

          {/* Stories List */}
          {stories.length === 0 ? (
            <EmptyState
              title="इस श्रेणी में अभी कोई कहानी नहीं है"
              description="जल्द ही इस श्रेणी में नई कहानियाँ जोड़ी जाएंगी।"
              actionText="सभी कहानियाँ देखें"
              actionHref="/"
            />
          ) : (
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
                      colour: story.category.colour,
                    },
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-rose-100 p-3 shadow-xs">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/category/${category.slug}`}
                createPageUrl={(p) =>
                  p === 1 ? `/category/${category.slug}` : `/category/${category.slug}?page=${p}`
                }
              />
            </div>
          )}
        </main>

        {/* Right Column: Portal Sidebar */}
        <Sidebar />
      </div>
    </Container>
  );
}
