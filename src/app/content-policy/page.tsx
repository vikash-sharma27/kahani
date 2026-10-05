import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'सामग्री नीति (Content & Safety Policy) | KahaniNest',
  description: 'KahaniNest की सामग्री नीति, बाल सुरक्षा (Zero-Tolerance on Underage), और सख्त आचार संहिता।',
  alternates: { canonical: `${baseUrl}/content-policy` },
};

export default function ContentPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 font-devanagari">
          सामग्री नीति (Content &amp; Safety Policy)
        </h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {process.env.SITE_NAME || 'KahaniNest'} वयस्कों (18+) के लिए एक जिम्मेदार मंच है। हमारी नीति शून्य-सहनशीलता (Zero-Tolerance) पर आधारित है।
        </p>

        <div className="space-y-6">
          <section className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
            <h2 className="text-lg font-bold text-red-900 mb-2 font-devanagari">
              पूर्णतः प्रतिबंधित सामग्री (Strictly Prohibited Content)
            </h2>
            <p className="text-sm text-red-800 mb-3">
              निम्नलिखित विषयों या तत्वों वाली किसी भी कहानी को तुरंत हटा दिया जाएगा और संबंधित उपयोगकर्ता/डिवाइस को हमेशा के लिए ब्लॉक कर दिया जाएगा:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-red-900">
              <li>
                <strong>नाबालिग (Minors / Under 18):</strong> 18 वर्ष से कम उम्र के पात्रों से संबंधित कोई भी यौन या अनुचित सामग्री।
              </li>
              <li>
                <strong>गैर-सहमति (Non-Consensual):</strong> बलात्कार, जबरदस्ती या किसी भी प्रकार की गैर-सहमति यौन क्रिया को वांछनीय या सामान्य रूप में दिखाना।
              </li>
              <li>
                <strong>वास्तविक जीवित या मृत व्यक्ति:</strong> किसी भी वास्तविक, पहचान योग्य व्यक्ति के नाम, छवि या संदर्भ में काल्पनिक वयस्क कथा।
              </li>
              <li>
                <strong>पशुगमन (Bestiality / Zoophilia):</strong> किसी भी रूप में पशुओं से संबंधित यौन क्रिया।
              </li>
              <li>
                <strong>गैर-कानूनी गतिविधियां:</strong> नशीले पदार्थों, हथियारों, आतंकवाद या किसी भी गैर-कानूनी गतिविधि के निर्देश या बढ़ावा।
              </li>
              <li>
                <strong>घृणा भाषण (Hate Speech):</strong> धर्म, जाति, लिंग या समुदाय के प्रति द्वेष फैलाने वाली सामग्री।
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-devanagari">
              मौलिकता एवं सहमति (Originality &amp; Consent)
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              प्लेटफ़ॉर्म पर प्रस्तुत प्रत्येक कहानी में दर्शाए गए सभी पात्र स्पष्ट रूप से वयस्क (18+) होने चाहिए। सभी अंतरंग दृश्य आपसी सहमति और परिपक्व निर्णय पर आधारित होने चाहिए।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 font-devanagari">
              सख्त प्रवर्तन एवं 24 घंटे की निष्कासन नीति
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              यदि कोई भी सामग्री हमारी नीति का उल्लंघन करती है, तो उसकी रिपोर्ट मिलने पर हमारी मॉडरेशन टीम 24 घंटे के भीतर उस सामग्री की समीक्षा करके उसे तत्काल हटा देती है।
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/report"
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              उल्लंघन की रिपोर्ट करें →
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              मुख्य पृष्ठ पर लौटें
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
