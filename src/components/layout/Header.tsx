'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Main Brand Header: Logo + Site Title + Search */}
      <div className="bg-white border-b border-rose-100 py-2 px-4 shadow-2xs">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">

          {/* Logo + Title Block */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 py-0.5">
            <Image
              src="/Website-logo.png"
              alt="Chut Ki Kahani"
              width={190}
              height={52}
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
            <div>
              <div className="text-base sm:text-xl font-black text-[#b8233e] tracking-tight leading-tight font-devanagari">
                Chut Ki Kahani
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 font-devanagari leading-snug max-w-[160px] sm:max-w-[240px]">
                18+ वयस्क पाठकों के लिए 100% मौलिक एवं काल्पनिक कहानियाँ
              </div>
            </div>
          </Link>

          {/* Quick Search on Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs justify-end">
            <form action="/search" method="GET" className="flex w-full">
              <input
                type="text"
                name="q"
                placeholder="कहानी या श्रेणी खोजें..."
                className="flex-1 px-3.5 py-1.5 text-xs border border-gray-300 rounded-l-md focus:outline-none focus:border-[#b8233e] font-devanagari"
              />
              <button
                type="submit"
                className="bg-[#b8233e] hover:bg-[#981b31] text-white px-3 py-1.5 text-xs font-bold rounded-r-md transition-colors"
              >
                खोजें
              </button>
            </form>
          </div>

          {/* Mobile: Search icon + Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              href="/search"
              aria-label="खोजें"
              className="p-2 text-gray-700 active:bg-gray-100 rounded-lg text-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              🔍
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="मेनू खोलें"
              className="p-2 text-gray-700 active:bg-gray-100 rounded-lg text-xl min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Dark) — Home + All Categories only */}
      <nav className="block bg-[#2c3e50] text-white border-y border-[#1a252f] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1100px] mx-auto px-4 flex items-center text-xs font-bold tracking-wide uppercase">
          <Link
            href="/"
            className="px-4 py-2.5 bg-[#1a252f] text-yellow-400 hover:text-white transition-colors flex items-center gap-1.5 font-devanagari"
          >
            <span>🏠</span>
            <span>होम (Home)</span>
          </Link>
          <Link
            href="/categories"
            className="px-4 py-2.5 hover:bg-[#1a252f] text-gray-100 hover:text-yellow-400 transition-colors font-devanagari"
          >
            📚 सभी श्रेणियाँ
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
        >
          <div className="w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-base text-gray-900 font-devanagari">
                कहानियों की श्रेणियां (Menu)
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 text-lg font-bold"
                aria-label="बंद करें"
              >
                ✕
              </button>
            </div>

            <div className="py-3 space-y-2 font-devanagari">
              <div className="pt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                मुख्य श्रेणियां
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-800 font-medium">
                <Link
                  href="/category/family-saga"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  पारिवारिक (Family)
                </Link>
                <Link
                  href="/category/romance"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  रोमांस (Romance)
                </Link>
                <Link
                  href="/category/drama"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  ड्रामा (Drama)
                </Link>
                <Link
                  href="/category/mystery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  रहस्य (Mystery)
                </Link>
                <Link
                  href="/category/fantasy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  फैंटेसी (Fantasy)
                </Link>
                <Link
                  href="/category/comedy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 min-h-[44px] flex items-center"
                >
                  कॉमेडी (Comedy)
                </Link>
              </div>

              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-[#b8233e] font-semibold"
                >
                  सभी श्रेणियां देखें →
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-gray-900"
                >
                  18+ अस्वीकरण (Disclaimer)
                </Link>
                <Link
                  href="/content-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-gray-900"
                >
                  सामग्री नीति (Content Policy)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
