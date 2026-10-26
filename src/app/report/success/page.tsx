import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'रिपोर्ट दर्ज हुई | Chut Ki Kahani',
  robots: { index: false, follow: false },
};

export default function ReportSuccessPage() {
  return (
    <Container className="py-16 text-center max-w-lg">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🚨
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 font-devanagari">
          रिपोर्ट दर्ज हो गई!
        </h1>
        <p className="text-gray-600 text-sm mb-6 font-devanagari leading-relaxed">
          आपकी रिपोर्ट हमारी टीम को भेज दी गई है। उच्च प्राथमिकता वाली शिकायतों की समीक्षा 24 घंटे के भीतर की जाती है।
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors"
        >
          ← मुख्य पृष्ठ पर जाएँ
        </Link>
      </div>
    </Container>
  );
}
