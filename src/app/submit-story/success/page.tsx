import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'कहानी सफलतापूर्वक भेजी गई | KahaniNest',
  robots: { index: false, follow: false },
};

export default function SubmitSuccessPage() {
  return (
    <Container className="py-16 text-center max-w-lg">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 font-devanagari">
          कहानी सफलतापूर्वक भेजी गई!
        </h1>
        <p className="text-gray-600 text-sm mb-6 font-devanagari leading-relaxed">
          आपकी कहानी हमारी समीक्षा टीम को भेज दी गई है। समीक्षा के बाद 2-3 कार्यदिवसों के भीतर प्रकाशित की जाएगी।
          यदि किसी कारण से स्वीकार नहीं की गई तो आपको सूचित किया जाएगा।
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors font-devanagari"
          >
            कहानियाँ पढ़ें →
          </Link>
          <Link
            href="/submit-story"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors font-devanagari"
          >
            एक और कहानी भेजें
          </Link>
        </div>
      </div>
    </Container>
  );
}
