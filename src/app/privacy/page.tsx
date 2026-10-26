import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | Chut Ki Kahani',
  description: 'Chut Ki Kahani की गोपनीयता नीति, डेटा सुरक्षा, कुकीज़ और उपयोगकर्ता गोपनीयता नियम।',
  alternates: { canonical: `${baseUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-devanagari">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          {process.env.SITE_NAME || 'Chut Ki Kahani'} पर हम आपके व्यक्तिगत डेटा की गोपनीयता का सम्मान करते हैं।
        </p>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 font-devanagari">
            1. कोई पाठक खाता नहीं (No Reader Accounts)
          </h2>
          <p>
            हमारे पाठकों के लिए कोई लॉगिन या खाता पंजीकरण प्रणाली नहीं है। हम पाठकों से कोई व्यक्तिगत विवरण (नाम, पता या फोन नंबर) एकत्र नहीं करते हैं।
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 font-devanagari">
            2. कुकीज़ और गुमनाम पहचानकर्ता (Cookies &amp; Device ID)
          </h2>
          <p>
            हम केवल आवश्यक कार्यों के लिए कुकीज़ का उपयोग करते हैं:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
            <li><strong>age_ok:</strong> आयु सत्यापन की पुष्टि को 30 दिनों तक याद रखने के लिए।</li>
            <li><strong>age_denied:</strong> अस्वीकार किए जाने पर 24 घंटे तक प्रवेश रोकने के लिए।</li>
            <li><strong>device_id:</strong> बुकमार्क, लाइक और टिप्पणी मॉडरेशन के लिए यादृच्छिक (random UUID) टोकन।</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-lg font-bold text-gray-900 font-devanagari">
            3. आईपी सुरक्षा एवं हैशिंग
          </h2>
          <p>
            स्पैम और दुरुपयोग की रोकथाम के लिए हम कभी भी कच्चा (raw) IP पता डेटाबेस में स्टोर नहीं करते। सभी IP पते सुरक्षित सॉल्ट के साथ क्रिप्टोग्राफ़िक रूप से हैश (HMAC SHA-256) किए जाते हैं।
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
