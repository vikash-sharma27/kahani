import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { env } from '@/lib/env';
import { AGE_COOKIE_NAME, AGE_DENIED_COOKIE_NAME } from '@/config/constants';
import { verifyAgeGateToken } from '@/lib/age-gate';
import { AgeGateModal } from '@/components/age-gate/AgeGateModal';
import { Header } from '@/components/layout/Header';
import { BottomBar } from '@/components/layout/BottomBar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KahaniNest – हिंदी एवं हिंग्लिश 18+ वयस्क कहानियाँ',
    template: `%s | ${env.SITE_NAME || 'KahaniNest'}`,
  },
  description:
    'KahaniNest पर पढ़ें मौलिक हिंदी और हिंग्लिश वयस्क कहानियाँ। पारिवारिक, रोमांस, ड्रामा, रहस्य और रोमांच से भरपूर 100% मौलिक काल्पनिक कहानियाँ।',
  applicationName: 'KahaniNest',
  authors: [{ name: 'KahaniNest Editorial Team' }],
  generator: 'Next.js',
  keywords: [
    'हिंदी कहानियाँ',
    'Hindi stories',
    'वयस्क कहानियाँ',
    '18+ Hindi kahani',
    'पारिवारिक कहानियाँ',
    'रोमांस कहानियाँ',
    'Hinglish adult stories',
    'KahaniNest',
    'desikahani',
    'desi stories in hindi',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'KahaniNest',
  publisher: 'KahaniNest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: ['en_US'],
    url: siteUrl,
    siteName: 'KahaniNest',
    title: 'KahaniNest – हिंदी एवं हिंग्लिश 18+ वयस्क कहानियाँ',
    description:
      'सर्वश्रेष्ठ हिंदी एवं हिंग्लिश वयस्क कहानियों का मंच। पारिवारिक, रोमांस, ड्रामा और रहस्य की लोकप्रिय कहानियाँ।',
    images: [
      {
        url: '/logo.png',
        width: 600,
        height: 200,
        alt: 'KahaniNest Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KahaniNest – 18+ Hindi Adult Stories',
    description: 'Read original Hindi and Hinglish adult fiction stories.',
    images: ['/logo.png'],
  },
  other: {
    rating: 'adult',
    'RTA-5042-1996-1400-1577-RTA': 'RTA-5042-1996-1400-1577-RTA',
    'content-language': 'hi, en',
    'geo.region': 'IN',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#201a24',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const ageCookie = cookieStore.get(AGE_COOKIE_NAME)?.value;
  const isAdult = await verifyAgeGateToken(ageCookie);
  const isDenied = Boolean(cookieStore.get(AGE_DENIED_COOKIE_NAME)?.value);
  const showOverlay = env.AGE_GATE_MODE === 'overlay' && !isAdult && !isDenied;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KahaniNest',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
  };

  return (
    <html lang="hi" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-red-100 selection:text-red-900 pb-14 md:pb-0">
        {showOverlay && <AgeGateModal returnTo="/" isOverlay={true} />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomBar />
      </body>
    </html>
  );
}
