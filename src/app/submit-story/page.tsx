'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { submitStoryAction, type SubmitResult } from '@/server/actions/submission';
import Link from 'next/link';

export default function SubmitStoryPage() {
  const [state, formAction] = useFormState<SubmitResult | null, FormData>(
    submitStoryAction,
    null
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-5">
          <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            18+ Adults Only
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-devanagari">
            ✍️ अपनी कहानी भेजें (Submit Your Story)
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-devanagari">
            KahaniNest पर अपनी मौलिक वयस्क हिंदी/हिंग्लिश कहानी प्रकाशित करवाएं।
          </p>
        </div>

        {/* Compliance Box */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl mb-6 text-sm text-red-900 space-y-1.5 font-devanagari">
          <p className="font-bold">कहानी भेजने से पहले ध्यान दें:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>सभी पात्र 18 वर्ष या उससे अधिक आयु के होने चाहिए।</li>
            <li>सभी सामग्री पूर्णतः काल्पनिक होनी चाहिए।</li>
            <li>किसी भी वास्तविक व्यक्ति का उपयोग प्रतिबंधित है।</li>
            <li>नाबालिगों से संबंधित या गैर-सहमति सामग्री स्वीकार नहीं की जाएगी।</li>
          </ul>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-devanagari">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Pen Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              आपका उपनाम / Pen Name *
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={60}
              placeholder="उदा. अमित शर्मा"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="आपका ईमेल (प्रकाशित नहीं किया जाएगा)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Story Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              कहानी का शीर्षक (Story Title) *
            </label>
            <input
              type="text"
              name="title"
              required
              minLength={5}
              maxLength={200}
              placeholder="उदा. दिल के करीब एक शाम..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              पसंदीदा श्रेणी (Preferred Category)
            </label>
            <select
              name="requestedCategory"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="romance">रोमांस (Romance)</option>
              <option value="drama">ड्रामा (Drama)</option>
              <option value="family-saga">पारिवारिक (Family Saga)</option>
              <option value="mystery">रहस्य (Mystery)</option>
              <option value="fantasy">फैंटेसी (Fantasy)</option>
              <option value="comedy">कॉमेडी (Comedy)</option>
            </select>
          </div>

          {/* Story Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              कहानी का पाठ (Story Content) *
            </label>
            <p className="text-xs text-gray-400 mb-1">
              न्यूनतम 200 शब्द | केवल टेक्स्ट, कोई छवि/फोटो नहीं
            </p>
            <textarea
              name="content"
              required
              minLength={200}
              maxLength={50000}
              rows={10}
              placeholder="यहाँ अपनी कहानी लिखें..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>

          {/* MANDATORY 18+ Checkbox */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="adultConfirmed"
                value="true"
                required
                className="mt-1 h-5 w-5 text-red-600 border-gray-300 rounded"
              />
              <span className="text-xs sm:text-sm font-bold text-red-900 font-devanagari">
                मैं पुष्टि करता/करती हूँ कि कहानी के सभी पात्र 18+ वयस्क हैं, सामग्री पूर्णतः काल्पनिक है और कोई भी प्रतिबंधित सामग्री शामिल नहीं है। (अनिवार्य) *
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-base shadow-sm transition-colors min-h-[48px] font-devanagari"
          >
            कहानी भेजें (Submit Story)
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          कहानी भेजकर आप हमारी{' '}
          <Link href="/content-policy" className="text-red-600 underline">
            सामग्री नीति
          </Link>{' '}
          और{' '}
          <Link href="/terms" className="text-red-600 underline">
            उपयोग की शर्तें
          </Link>{' '}
          स्वीकार करते हैं।
        </p>
      </div>
    </div>
  );
}
