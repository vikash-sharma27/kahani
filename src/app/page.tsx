import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { StoryCard } from '@/components/story/StoryCard';
import { Pagination } from '@/components/ui/Pagination';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sidebar } from '@/components/layout/Sidebar';
import { STORIES_PER_PAGE } from '@/config/constants';
import { StoryStatus } from '@prisma/client';

export const revalidate = 120; // Cache for 2 minutes for high performance

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'Chut Ki Kahani – हिंदी एवं हिंग्लिश 18+ वयस्क कहानियाँ | Best Desi Adult Stories',
  description:
    'Chut Ki Kahani पर पढ़ें मौलिक हिंदी और हिंग्लिश वयस्क कहानियाँ। पारिवारिक, रोमांस, ड्रामा, थ्रिलर और रहस्य की 100% मौलिक व काल्पनिक कहानियाँ।',
  keywords: [
    'हिंदी कहानियाँ',
    'वयस्क कहानियाँ',
    '18+ Hindi Stories',
    'Hindi kahani',
    'पारिवारिक कहानियाँ',
    'रोमांस कहानियाँ',
    'desikahani',
    'Chut Ki Kahani',
    'Hinglish stories',
  ],
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'Chut Ki Kahani – हिंदी एवं हिंग्लिश 18+ वयस्क कहानियाँ',
    description:
      'सर्वश्रेष्ठ हिंदी एवं हिंग्लिश वयस्क कहानियों का प्रमुख मंच। पारिवारिक, रोमांस, ड्रामा और रहस्य की लोकप्रिय कहानियाँ।',
    url: baseUrl,
    siteName: 'Chut Ki Kahani',
    locale: 'hi_IN',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 200,
        alt: 'Chut Ki Kahani Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chut Ki Kahani – 18+ Adult Stories in Hindi',
    description: 'Read original Hindi and Hinglish adult fiction stories.',
    images: [`${baseUrl}/logo.png`],
  },
};

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const skip = (page - 1) * STORIES_PER_PAGE;

  // Ultra-optimized query: Select ONLY card fields (no heavy 50KB content fields)
  const [total, stories] = await Promise.all([
    db.story.count({ where: { status: StoryStatus.PUBLISHED } }),
    db.story.findMany({
      where: { status: StoryStatus.PUBLISHED },
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

  // JSON-LD Structured Data: WebSite with SearchAction + ItemList Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Chut Ki Kahani',
        description: '18+ adult fiction reading platform for Hindi and Hinglish stories.',
        inLanguage: 'hi',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/#webpage`,
        url: baseUrl,
        name: 'Chut Ki Kahani – ताज़ा प्रकाशित कहानियाँ',
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@type': 'Thing', name: 'Adult Fiction Stories in Hindi' },
      },
      {
        '@type': 'ItemList',
        itemListElement: stories.map((s, index) => ({
          '@type': 'ListItem',
          position: skip + index + 1,
          name: s.title,
          url: `${baseUrl}/story/${s.slug}`,
        })),
      },
    ],
  };

  return (
    <Container className="py-4 md:py-6">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2-Column Portal Layout (Main Feed + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Story Listing */}
        <main className="space-y-4">
          {/* Stories Feed with 3D physical cards */}
          {stories.length === 0 ? (
            <EmptyState />
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
          <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 p-3 shadow-2xs">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/"
              createPageUrl={(p) => (p === 1 ? '/' : `/?page=${p}`)}
            />
          </div>
        </main>

        {/* Right Column: Portal Sidebar */}
        <Sidebar />
      </div>
    </Container>
  );
}
