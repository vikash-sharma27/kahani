import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'प्रवेश वर्जित (Access Denied)',
  description: '18+ आयु सीमा के कारण प्रवेश वर्जित किया गया है।',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
          18+
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-devanagari">
          प्रवेश वर्जित (Access Denied)
        </h1>

        <p className="text-gray-700 text-base mb-3 font-devanagari">
          Sorry, you must be 18 or older to use this website.
        </p>

        <p className="text-gray-500 text-sm mb-6 font-devanagari">
          यह वेबसाइट केवल 18 वर्ष या उससे अधिक आयु के वयस्कों के लिए आरक्षित है। आपकी पुष्टि के अनुसार आप इस वेबसाइट की सामग्री देखने के पात्र नहीं हैं।
        </p>

        <div className="pt-2 border-t border-gray-100">
          <a
            href="https://www.google.com"
            rel="noopener noreferrer"
            className="inline-block w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-colors"
          >
            सुरक्षित वेबसाइट पर जाएं (Go to Google) →
          </a>
        </div>
      </div>
    </div>
  );
}
