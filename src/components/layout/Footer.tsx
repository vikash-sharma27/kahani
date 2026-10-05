import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1a252f] text-gray-300 border-t-4 border-[#c0292b] mt-auto pt-8 pb-14 md:pb-8 px-4">
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* Top Disclaimer Badge Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-gray-800 text-xs text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-[#c0292b] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              18+ Adults Only
            </span>
            <span className="text-gray-400 font-devanagari">
              यह वेबसाइट केवल 18 वर्ष या उससे अधिक आयु के वयस्कों के लिए है।
            </span>
          </div>

          <div className="text-gray-400 text-[11px] font-devanagari">
            सभी कहानियाँ, पात्र एवं घटनाएँ पूर्णतः काल्पनिक हैं।
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-devanagari text-gray-400 pb-4 border-b border-gray-800">
          <Link href="/report" className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
            <span>🚨</span>
            <span>उल्लंघन रिपोर्ट करें</span>
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            DMCA टेकडाउन संपर्क
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/disclaimer" className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>
            &copy; {currentYear} {process.env.SITE_NAME || 'Chut Ki Kahani'}. सर्वाधिकार सुरक्षित। All characters portrayed are fictitious and 18+.
          </p>
          <p className="font-mono text-gray-600">
            18+ Adults Only Content Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
