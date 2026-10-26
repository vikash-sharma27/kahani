import React from 'react';
import Link from 'next/link';
import { acceptAgeGate, denyAgeGate } from '@/server/actions/age-gate';

interface AgeGateModalProps {
  returnTo?: string;
  isOverlay?: boolean;
}

export function AgeGateModal({ returnTo = '/', isOverlay = false }: AgeGateModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className={
        isOverlay
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto'
          : 'min-h-[80vh] flex items-center justify-center p-4'
      }
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8 text-center text-gray-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Adult Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          18+ Adults Only
        </div>

        {/* Brand / Logo */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900 font-devanagari">
          {process.env.SITE_NAME || 'Chut Ki Kahani'}
        </h1>

        {/* Primary Hindi Question */}
        <p
          id="age-gate-title"
          className="text-base md:text-lg text-gray-800 font-medium leading-relaxed font-devanagari mb-6"
        >
          यह वेबसाइट केवल 18 वर्ष या उससे अधिक आयु के वयस्कों के लिए है। क्या आपकी आयु 18 वर्ष या उससे अधिक है?
        </p>

        {/* Actions Form (Works with or without JavaScript via Server Action) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <form action={acceptAgeGate} className="w-full sm:w-1/2">
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
              type="submit"
              className="w-full min-h-[48px] px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-base transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-devanagari"
            >
              हाँ, प्रवेश करें
            </button>
          </form>

          <form action={denyAgeGate} className="w-full sm:w-1/2">
            <button
              type="submit"
              className="w-full min-h-[48px] px-6 py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-xl text-base transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 font-devanagari"
            >
              नहीं, बाहर जाएं
            </button>
          </form>
        </div>

        {/* Disclaimer / Compliance Notice */}
        <p className="text-xs text-gray-500 leading-normal mb-5 font-devanagari">
          प्रवेश करके आप पुष्टि करते हैं कि आपकी आयु 18+ है और सभी सामग्री काल्पनिक एवं केवल वयस्कों के मनोरंजन के लिए है।
        </p>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <Link href="/disclaimer" className="hover:text-red-600 underline underline-offset-2">
            अस्वीकरण (Disclaimer)
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="hover:text-red-600 underline underline-offset-2">
            नियम (Terms)
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="hover:text-red-600 underline underline-offset-2">
            गोपनीयता (Privacy)
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/content-policy" className="hover:text-red-600 underline underline-offset-2">
            Content Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
