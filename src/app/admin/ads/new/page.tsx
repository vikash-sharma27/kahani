import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { Role, AdPosition } from '@prisma/client';
import { createAdAction } from '@/server/actions/ads-admin';

export const metadata: Metadata = { title: 'New Ad Slot | Admin' };

/** Position ke liye human-readable labels */
const POSITION_LABELS: Record<AdPosition, string> = {
  HOME_TOP:      'Home — Top Banner',
  HOME_MIDDLE_1: 'Home — Middle (1st)',
  HOME_MIDDLE_2: 'Home — Middle (2nd)',
  HOME_BOTTOM:   'Home — Bottom Banner',
  LIST_IN_FEED:  'Story List — In-Feed',
  STORY_TOP:     'Story Page — Top',
  STORY_MIDDLE_1:'Story Page — Middle (1st)',
  STORY_MIDDLE_2:'Story Page — Middle (2nd)',
  STORY_BOTTOM:  'Story Page — Bottom',
  STICKY_MOBILE: 'Sticky Footer (Mobile)',
};

export default async function NewAdPage() {
  await requireRole(Role.ADMIN);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/ads"
          className="text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          ← Back to Ads
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">New Ad Slot</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <form action={createAdAction} className="space-y-5">

          {/* Ad Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Ad Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Google AdSense — Home Top"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-400">
              Sirf admin ke liye label hai — visitors ko nahi dikhta.
            </p>
          </div>

          {/* Position Dropdown */}
          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-1">
              Position (Jagah) <span className="text-red-500">*</span>
            </label>
            <select
              id="position"
              name="position"
              required
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
            >
              <option value="" disabled>— Select a position —</option>
              {Object.entries(POSITION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Website pe kahan dikhega ye ad.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="enabled"
                  value="true"
                  defaultChecked
                  className="accent-red-600"
                />
                <span className="text-sm text-gray-700">Active (abhi se dikhaye)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="enabled"
                  value="false"
                  className="accent-red-600"
                />
                <span className="text-sm text-gray-700">Disabled (baad mein activate karna)</span>
              </label>
            </div>
          </div>

          {/* HTML / Script Code */}
          <div>
            <label htmlFor="htmlCode" className="block text-sm font-semibold text-gray-700 mb-1">
              Ad HTML / Script Code <span className="text-red-500">*</span>
            </label>
            <textarea
              id="htmlCode"
              name="htmlCode"
              required
              rows={8}
              placeholder={`Company ka diya hua code yahan paste karo, jaise:\n\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" ...></script>\n<ins class="adsbygoogle" ...></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-y"
            />
            <p className="mt-1 text-xs text-gray-400">
              Google AdSense, Media.net, ya kisi bhi ad network ka embed code yahan paste karo.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
            ⚠️ <strong>Dhyan rakho:</strong> Yahan sirf trusted ad networks ka code paste karo.
            Galat code se website slow ya unsafe ho sakti hai.
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              Save Ad Slot
            </button>
            <Link
              href="/admin/ads"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
