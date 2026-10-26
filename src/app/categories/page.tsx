import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'सभी कहानी श्रेणियाँ (All Story Categories) | Chut Ki Kahani',
  description:
    'Chut Ki Kahani की सभी वयस्क कहानी श्रेणियाँ देखें – पारिवारिक, रोमांस, ड्रामा, रहस्य, फैंटेसी और कॉमेडी की लोकप्रिय हिंदी व हिंग्लिश कहानियाँ।',
  keywords: [
    'कहानी श्रेणियाँ',
    'हिंदी स्टोरी केटेगरी',
    'Hindi story categories',
    'रोमांस कहानियाँ',
    'पारिवारिक कहानियाँ',
    'वयस्क कहानियाँ',
    'Chut Ki Kahani',
  ],
  alternates: { canonical: `${baseUrl}/categories` },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
  openGraph: {
    title: 'सभी कहानी श्रेणियाँ (All Categories) | Chut Ki Kahani',
    description:
      'अपनी पसंदीदा श्रेणी चुनें – पारिवारिक, रोमांस, ड्रामा, रहस्य, और फैंटेसी की सैकड़ों मौलिक कहानियाँ।',
    url: `${baseUrl}/categories`,
    siteName: 'Chut Ki Kahani',
    locale: 'hi_IN',
    type: 'website',
    images: [{ url: `${baseUrl}/logo.png`, width: 600, height: 200, alt: 'Chut Ki Kahani Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'सभी कहानी श्रेणियाँ | Chut Ki Kahani',
    description: 'Explore all Hindi adult fiction story categories on Chut Ki Kahani.',
    images: [`${baseUrl}/logo.png`],
  },
  other: {
    rating: 'adult',
    'RTA-5042-1996-1400-1577-RTA': 'RTA-5042-1996-1400-1577-RTA',
  },
};

export default async function CategoriesPage() {
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    colour: string;
    _count: { stories: number };
  }> = [];

  try {
    categories = await db.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { stories: { where: { status: 'PUBLISHED' } } },
        },
      },
    });
  } catch (err) {
    console.warn('Database not available during build for categories:', err);
  }

  // JSON-LD Breadcrumbs and CollectionPage Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/categories` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'सभी कहानी श्रेणियाँ | Chut Ki Kahani',
        url: `${baseUrl}/categories`,
        description: 'Explore all adult story categories on Chut Ki Kahani.',
        hasPart: categories.map((cat) => ({
          '@type': 'WebPage',
          name: cat.name,
          url: `${baseUrl}/category/${cat.slug}`,
          description: cat.description || `${cat.name} कहानियाँ`,
        })),
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
        <Breadcrumbs items={[{ label: 'सभी श्रेणियाँ' }]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <main className="space-y-4">
          <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-[#b8233e] p-5 shadow-2xs">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a252f] font-devanagari flex items-center gap-2">
              <span>📚</span>
              <span>सभी कहानी श्रेणियां (All Story Categories)</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-devanagari">
              अपनी पसंदीदा श्रेणी चुनें और सैकड़ों मौलिक वयस्क कहानियाँ पढ़ना शुरू करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="card-3d border-l-[5px] border-l-[#b8233e] p-4.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h2 className="font-bold text-base text-gray-900 group-hover:text-[#b8233e] transition-colors font-devanagari">
                      {cat.name}
                    </h2>
                    <span className="text-xs font-mono font-bold bg-rose-50 text-[#b8233e] border border-rose-100 px-2 py-0.5 rounded-md">
                      {cat._count.stories} कहानियाँ
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 font-devanagari leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-rose-50 flex justify-end">
                  <span className="text-xs font-bold text-[#b8233e] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-devanagari">
                    <span>कहानियाँ देखें</span>
                    <span>»</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Sidebar />
      </div>
    </Container>
  );
}
