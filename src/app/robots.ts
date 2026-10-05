import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/age-gate',
          '/access-denied',
          '/search',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
