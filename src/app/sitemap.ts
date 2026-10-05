import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { StoryStatus } from '@prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/content-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/report`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Published Stories
  let storyRoutes: MetadataRoute.Sitemap = [];
  try {
    const stories = await db.story.findMany({
      where: { status: StoryStatus.PUBLISHED },
      select: { slug: true, updatedAt: true, publishedAt: true },
      take: 5000,
    });

    storyRoutes = stories.map((s) => ({
      url: `${baseUrl}/story/${s.slug}`,
      lastModified: s.updatedAt || s.publishedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch (e) {
    console.error('Error fetching stories for sitemap:', e);
  }

  // 3. Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await db.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Error fetching categories for sitemap:', e);
  }

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes];
}
