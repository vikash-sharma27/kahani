import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'उपयोग की शर्तें (Terms of Service) | Chut Ki Kahani',
  description: 'Chut Ki Kahani 18+ वयस्क कहानी मंच की उपयोग की कानूनी शर्तें, नियम एवं दायित्व।',
  alternates: { canonical: `${baseUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-devanagari">
          उपयोग की शर्तें (Terms of Service)
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          अंतिम अद्यतन: अक्टूबर 2026. {process.env.SITE_NAME || 'Chut Ki Kahani'} का उपयोग करने से पहले इन शर्तों को ध्यान से पढ़ें।
        </p>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed font-devanagari">
          <h2 className="text-lg font-bold text-gray-900">1. आयु सीमा (18+ Age Requirement)</h2>
          <p>
            इस वेबसाइट की संपूर्ण सामग्री केवल उन व्यक्तियों के लिए है जिनकी आयु 18 वर्ष या उससे अधिक है। यदि आप 18 वर्ष से कम आयु के हैं, तो इस वेबसाइट का उपयोग करना पूर्णतः प्रतिबंधित है।
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed font-devanagari">
          <h2 className="text-lg font-bold text-gray-900">2. काल्पनिक सामग्री (Fictional Content)</h2>
          <p>
            वेबसाइट पर उपलब्ध सभी कहानियाँ, पात्र, संवाद और घटनाएँ पूर्णतः काल्पनिक हैं। किसी भी जीवित या मृत व्यक्ति, संस्था या वास्तविक घटना से कोई भी समानता केवल संयोग मात्र है।
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed font-devanagari">
          <h2 className="text-lg font-bold text-gray-900">3. उपयोगकर्ता आचरण और प्रस्तुतियाँ</h2>
          <p>
            उपयोगकर्ता द्वारा प्रस्तुत की जाने वाली सामग्री में कोई भी नाबालिग, गैर-सहमति, या गैर-कानूनी तत्व शामिल नहीं होना चाहिए। ऐसी सामग्री पाए जाने पर कानूनी कार्रवाई की जा सकती है।
          </p>
        </section>

        <div className="pt-4 border-t border-gray-100">
          <Link href="/" className="text-sm text-red-600 hover:underline">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}
