import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';
const contactEmail = process.env.NOTIFY_EMAIL || 'helloworld140407@gmail.com';

export const metadata: Metadata = {
  title: 'संपर्क एवं DMCA टेकडाउन (Contact & DMCA) | Chut Ki Kahani',
  description: 'Chut Ki Kahani संपादकीय एवं कानूनी टीम से संपर्क करें। DMCA टेकडाउन एवं कॉपीराइट नोटिस की आधिकारिक प्रक्रिया।',
  alternates: { canonical: `${baseUrl}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white border border-rose-200 border-b-4 border-b-rose-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-devanagari">
          संपर्क एवं DMCA टेकडाउन सूचना (Contact &amp; DMCA Takedown)
        </h1>

        <p className="text-sm text-gray-700 leading-relaxed font-devanagari">
          {process.env.SITE_NAME || 'Chut Ki Kahani'} बौद्धिक संपदा अधिकारों और सामग्री दिशानिर्देशों का कड़ाई से सम्मान करता है। यदि आप कॉपीराइट स्वामी हैं या किसी सामग्री की शिकायत करना चाहते हैं, तो कृपया नीचे दिए गए बटन पर क्लिक करके हमें विवरण भेजें:
        </p>

        {/* Secure Email Button Box - Email is stored and not exposed as plain text to web scrapers */}
        <div className="p-5 bg-rose-50/60 rounded-xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-900 font-devanagari flex items-center gap-1.5">
              <span>🛡️</span>
              <span>आधिकारिक कानूनी सहायता (Official Legal Support)</span>
            </p>
            <p className="text-xs text-gray-500 font-devanagari mt-1">
              (औपचारिक नोटिस पर त्वरित प्रतिक्रिया समय: 24 घंटे के भीतर)
            </p>
          </div>

          <a
            href={`mailto:${contactEmail}?subject=DMCA%20Takedown%20Notice%20-%20Chut%20Ki%20Kahani`}
            className="btn-3d px-5 py-2.5 bg-gradient-to-r from-[#b8233e] to-[#91152a] hover:from-[#cb2846] hover:to-[#a21931] text-white font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-2 font-devanagari transition-all flex-shrink-0"
          >
            <span>✉️</span>
            <span>ईमेल द्वारा संपर्क करें (Send Email)</span>
          </a>
        </div>

        <section className="space-y-3 text-sm text-gray-700 font-devanagari">
          <h2 className="text-lg font-bold text-gray-900">
            DMCA टेकडाउन अनुरोध के लिए आवश्यक जानकारी
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-2 text-xs sm:text-sm">
            <li>मूल कॉपीराइट कार्य का शीर्षक एवं विवरण।</li>
            <li>विवादित सामग्री का सटीक URL लिंक।</li>
            <li>आपका पूर्ण संपर्क विवरण (नाम, पता, फ़ोन नंबर)।</li>
            <li>यह बयान कि यह शिकायत सद्भावना (Good Faith) से की जा रही है।</li>
          </ul>
        </section>

        <div className="pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/report"
            className="btn-3d px-4 py-2 bg-rose-100 hover:bg-rose-200 text-[#b8233e] font-bold text-xs rounded-lg transition-colors font-devanagari"
          >
            🚨 तुरंत ऑनलाइन रिपोर्ट दर्ज करें →
          </Link>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 font-devanagari">
            ← मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}
