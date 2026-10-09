import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { Role, AdPosition } from '@prisma/client';
import { toggleAdAction, deleteAdAction } from '@/server/actions/ads-admin';

export const metadata: Metadata = { title: 'Advertisements Manager | Admin' };

const POSITION_LABELS: Record<AdPosition, string> = {
  HOME_TOP:      'Home — Top',
  HOME_MIDDLE_1: 'Home — Middle 1',
  HOME_MIDDLE_2: 'Home — Middle 2',
  HOME_BOTTOM:   'Home — Bottom',
  LIST_IN_FEED:  'Story List — In-Feed',
  STORY_TOP:     'Story — Top',
  STORY_MIDDLE_1:'Story — Middle 1',
  STORY_MIDDLE_2:'Story — Middle 2',
  STORY_BOTTOM:  'Story — Bottom',
  STICKY_MOBILE: 'Sticky Footer (Mobile)',
};

export default async function AdminAdsPage() {
  await requireRole(Role.ADMIN);

  const ads = await db.advertisement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisements Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Company ka diya hua code yahan manage karo.
          </p>
        </div>
        <Link
          href="/admin/ads/new"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          + New Ad Slot
        </Link>
      </div>

      {/* Ads Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  <div className="text-3xl mb-2">📭</div>
                  <div>Koi ad slot nahi hai abhi.</div>
                  <Link
                    href="/admin/ads/new"
                    className="mt-3 inline-block text-sm text-red-600 hover:underline font-medium"
                  >
                    + Pehla Ad banao
                  </Link>
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ad.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {POSITION_LABELS[ad.position] ?? ad.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        ad.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ad.enabled ? '● ACTIVE' : '○ DISABLED'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Enable/Disable */}
                      <form
                        action={async () => {
                          'use server';
                          await toggleAdAction(ad.id, ad.enabled);
                        }}
                      >
                        <button
                          type="submit"
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                            ad.enabled
                              ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {ad.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </form>

                      {/* Delete */}
                      <form
                        action={async () => {
                          'use server';
                          await deleteAdAction(ad.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          onClick={undefined}
                          formAction={async (formData) => {
                            'use server';
                            void formData;
                            await deleteAdAction(ad.id);
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Available Positions Reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3">
          📍 Available Ad Positions (Reference)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(POSITION_LABELS).map(([pos, label]) => {
            const isUsed = ads.some((a) => a.position === pos);
            return (
              <div
                key={pos}
                className={`text-xs px-3 py-2 rounded-lg border ${
                  isUsed
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-semibold">{label}</div>
                <div className="font-mono text-gray-400 text-[10px]">{pos}</div>
                {isUsed && (
                  <div className="text-[10px] font-bold text-red-500 mt-0.5">● In use</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
