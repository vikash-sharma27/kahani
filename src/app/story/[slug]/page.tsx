import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StoryReader } from '@/components/story/StoryReader';
import { CommentList } from '@/components/story/CommentList';
import { CommentForm } from '@/components/story/CommentForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { formatDate } from '@/lib/utils';
import { StoryStatus } from '@prisma/client';

export const revalidate = 600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

interface StoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const story = await db.story.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      status: true,
      authorName: true,
      publishedAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true } },
    },
  });

  if (!story || story.status !== StoryStatus.PUBLISHED) {
    return { title: 'Story Not Found' };
  }

  const title = story.seoTitle || `${story.title} – ${story.category.name} कहानी | Chut Ki Kahani`;
  const description = story.seoDescription || story.excerpt;
  const canonicalUrl = `${baseUrl}/story/${story.slug}`;

  return {
    title,
    description,
    keywords: [
      story.title,
      `${story.category.name} कहानी`,
      `${story.authorName} की कहानी`,
      'हिंदी वयस्क कहानियाँ',
      'Hindi stories',
      'Chut Ki Kahani',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Chut Ki Kahani',
      type: 'article',
      locale: 'hi_IN',
      publishedTime: (story.publishedAt || new Date()).toISOString(),
      modifiedTime: (story.updatedAt || story.publishedAt || new Date()).toISOString(),
      section: story.category.name,
      authors: [story.authorName],
      tags: [story.category.name, 'Hindi Adult Stories', 'Chut Ki Kahani'],
      images: [
        {
          url: `${baseUrl}/logo.png`,
          width: 600,
          height: 200,
          alt: story.title,
        },
      ],
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

export default async function StoryPage({ params }: StoryPageProps) {
  const story = await db.story.findUnique({
    where: { slug: params.slug },
    include: { category: true, parts: { orderBy: { partNumber: 'asc' } } },
  });

  if (!story || story.status !== StoryStatus.PUBLISHED) notFound();

  // Increment view count in background without blocking SSR
  db.story
    .update({
      where: { id: story.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  // Fetch next & previous stories in same category (lightweight query)
  const [prevStory, nextStory] = await Promise.all([
    db.story.findFirst({
      where: {
        categoryId: story.categoryId,
        status: StoryStatus.PUBLISHED,
        publishedAt: { lt: story.publishedAt || story.createdAt },
      },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true },
    }),
    db.story.findFirst({
      where: {
        categoryId: story.categoryId,
        status: StoryStatus.PUBLISHED,
        publishedAt: { gt: story.publishedAt || story.createdAt },
      },
      orderBy: { publishedAt: 'asc' },
      select: { title: true, slug: true },
    }),
  ]);

  const wordCount = story.content ? story.content.trim().split(/\s+/).length : 500;
  const storyUrl = `${baseUrl}/story/${story.slug}`;

  // Complete JSON-LD Structured Data: Breadcrumbs + Article Schema
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
            name: story.category.name,
            item: `${baseUrl}/category/${story.category.slug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: story.title,
            item: storyUrl,
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${storyUrl}#article`,
        isPartOf: { '@type': 'WebSite', '@id': `${baseUrl}/#website` },
        headline: story.title,
        description: story.excerpt,
        author: {
          '@type': 'Person',
          name: story.authorName,
        },
        datePublished: (story.publishedAt || story.createdAt).toISOString(),
        dateModified: (story.updatedAt || story.publishedAt || story.createdAt).toISOString(),
        publisher: {
          '@type': 'Organization',
          name: 'Chut Ki Kahani',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': storyUrl,
        },
        inLanguage: 'hi',
        articleSection: story.category.name,
        genre: story.category.name,
        wordCount,
        timeRequired: `PT${story.readingTimeMin || 5}M`,
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
            { label: story.category.name, href: `/category/${story.category.slug}` },
            { label: story.title },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Reader view with 3D physical card effect */}
        <main className="space-y-4">
          <div className="bg-white rounded-xl border border-rose-100 p-5 sm:p-8 shadow-xs">
            <StoryReader
              title={story.title}
              authorName={story.authorName}
              content={story.content}
              readingTimeMin={story.readingTimeMin}
              categoryName={story.category.name}
            />

            {/* Next / Previous Story 3D Navigation Bar */}
            <div className="mt-8 pt-6 border-t border-rose-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-devanagari">
              {prevStory ? (
                <Link
                  href={`/story/${prevStory.slug}`}
                  className="card-3d p-3.5 flex flex-col group border-l-4 border-l-gray-400 hover:border-l-[#b8233e]"
                >
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">‹ पिछली कहानी</span>
                  <span className="font-bold text-gray-800 group-hover:text-[#b8233e] line-clamp-1 mt-1 transition-colors">{prevStory.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {nextStory && (
                <Link
                  href={`/story/${nextStory.slug}`}
                  className="card-3d p-3.5 flex flex-col text-right sm:items-end group border-r-4 border-r-gray-400 hover:border-r-[#b8233e]"
                >
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">अगली कहानी ›</span>
                  <span className="font-bold text-gray-800 group-hover:text-[#b8233e] line-clamp-1 mt-1 transition-colors">{nextStory.title}</span>
                </Link>
              )}
            </div>

            {/* Story Meta Bar */}
            <div className="mt-6 pt-4 border-t border-rose-50 flex flex-wrap items-center gap-3 text-xs text-gray-500 font-devanagari">
              <span className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-rose-800 font-medium">
                📅 {formatDate(story.publishedAt || story.createdAt)}
              </span>
              <span>•</span>
              <span className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium">
                👁️ {story.viewCount} views
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <CommentList storyId={story.id} />

          {/* Comment Submit Form */}
          <CommentForm storyId={story.id} storySlug={story.slug} />
        </main>

        {/* Right Column: Portal Sidebar */}
        <Sidebar />
      </div>
    </Container>
  );
}
