import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'अस्वीकरण (18+ Legal Disclaimer) | Chut Ki Kahani',
  description: '18+ कानूनी अस्वीकरण एवं शर्तें – Chut Ki Kahani पर सभी सामग्री केवल वयस्क पाठकों के लिए और 100% काल्पनिक है।',
  alternates: { canonical: `${baseUrl}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="border border-red-200 bg-red-50/50 rounded-xl p-6 md:p-8 mb-8">
        <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-4 uppercase">
          18+ केवल वयस्क पाठकों के लिए
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 font-devanagari">
          अस्वीकरण (Legal Disclaimer)
        </h1>

        {/* EXACT HINDI TEXT REQUIRED BY PROMPT */}
        <div className="space-y-4 text-gray-800 text-base md:text-lg leading-relaxed font-devanagari">
          <p>
            यह वेबसाइट केवल 18 वर्ष या उससे अधिक आयु के वयस्कों के लिए है। इस वेबसाइट पर उपलब्ध कहानियाँ केवल वयस्क पाठकों के मनोरंजन के उद्देश्य से प्रकाशित की जाती हैं।
          </p>
          <p>
            यदि आपकी आयु 18 वर्ष से कम है, तो कृपया इस वेबसाइट का उपयोग न करें और तुरंत वेबसाइट छोड़ दें।
          </p>
          <p>
            वेबसाइट पर प्रकाशित कहानियाँ लेखकों/उपयोगकर्ताओं द्वारा भेजी जा सकती हैं और उनके विचार व्यक्तिगत हो सकते हैं। प्रकाशन से पहले समीक्षा का प्रयास किया जाता है, लेकिन किसी सामग्री के वास्तविक घटना होने की गारंटी नहीं दी जाती।
          </p>
          <p>
            सभी पात्र और घटनाएँ केवल वयस्क एवं सहमति-आधारित संदर्भ में प्रस्तुत की जानी चाहिए। नाबालिगों से संबंधित यौन सामग्री, गैर-सहमति वाली यौन सामग्री या अन्य प्रतिबंधित सामग्री स्वीकार या प्रकाशित नहीं की जाएगी।
          </p>
          <p>
            यदि आपको लगता है कि किसी सामग्री से नियमों का उल्लंघन हुआ है, तो कृपया हमें तुरंत सूचित करें ताकि उसकी समीक्षा की जा सके।
          </p>
          <p>
            इस वेबसाइट में प्रवेश करके आप पुष्टि करते हैं कि आपकी आयु 18 वर्ष या उससे अधिक है और आप वेबसाइट की शर्तें एवं अस्वीकरण को स्वीकार करते हैं।
          </p>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* EXACT ENGLISH TEXT REQUIRED BY PROMPT */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          English Translation
        </h2>
        <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
          <p>
            This website is only for adults aged 18 years or older. The stories available on this website are published solely for the entertainment of adult readers.
          </p>
          <p>
            If you are under 18 years of age, please do not use this website and leave immediately.
          </p>
          <p>
            Stories published on this website may be submitted by authors/users, and their views may be personal. We make an effort to review stories before publication, but we do not guarantee that any content is based on real events.
          </p>
          <p>
            All characters and events must be presented only in an adult and consensual context. Sexual content involving minors, non-consensual sexual content or other prohibited content will not be accepted or published.
          </p>
          <p>
            If you believe any content violates the rules, please inform us immediately so it can be reviewed.
          </p>
          <p>
            By entering this website you confirm that you are 18 years of age or older and that you accept the website&apos;s terms and disclaimer.
          </p>
        </div>
      </div>

      {/* Parental Controls & Takedown process */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 text-sm text-gray-700">
        <h3 className="text-base font-bold text-gray-900">
          अभिभावक नियंत्रण (Parental Controls)
        </h3>
        <p>
          यदि आपके घर में नाबालिग बच्चे इंटरनेट का उपयोग करते हैं, तो हम माता-पिता और अभिभावकों को फ़िल्टरिंग सॉफ़्टवेयर (जैसे Google Family Link, OpenDNS, Net Nanny) का उपयोग करने की सलाह देते हैं ताकि वे वयस्क सामग्री तक न पहुँच सकें।
        </p>

        <h3 className="text-base font-bold text-gray-900 pt-2">
          सामग्री हटाने की प्रक्रिया (Report &amp; Takedown)
        </h3>
        <p>
          यदि आपको लगता है कि किसी कहानी में कोई कॉपीराइट उल्लंघन, गैर-सहमति सामग्री या नियमों का उल्लंघन है, तो तुरंत हमारे{' '}
          <Link href="/report" className="text-red-600 underline font-medium">
            रिपोर्ट पेज
          </Link>{' '}
          या{' '}
          <Link href="/contact" className="text-red-600 underline font-medium">
            संपर्क फ़ॉर्म
          </Link>{' '}
          पर सूचना दें। ऐसी सामग्री की तुरंत जांच कर 24 घंटे के भीतर हटा दिया जाता है।
        </p>

        <div className="pt-4 border-t border-gray-100 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            ← मुख्य पृष्ठ पर वापस जाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}
