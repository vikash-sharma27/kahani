import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'मेरे बुकमार्क (My Bookmarks) | KahaniNest',
  description: 'आपकी सहेजी गई कहानियाँ।',
};

export default function BookmarksPage() {
  return (
    <Container className="py-8 text-center max-w-lg">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-4xl mb-4">🔖</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 font-devanagari">
          मेरे बुकमार्क (My Bookmarks)
        </h1>
        <p className="text-gray-600 text-sm mb-6 font-devanagari">
          बुकमार्क सुविधा जल्द ही उपलब्ध होगी। कहानी पढ़ते समय ❤️ और 🔖 बटन दबाकर सहेजें।
        </p>
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors"
        >
          ← सभी कहानियाँ पढ़ें
        </Link>
      </div>
    </Container>
  );
}
