import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { Role, AdPosition } from '@prisma/client';

export const metadata: Metadata = { title: 'Advertisements Manager | Admin' };

export default async function AdminAdsPage() {
  await requireRole(Role.ADMIN);

  const ads = await db.advertisement.findMany({
    orderBy: { position: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Advertisements Manager</h1>
        <Link
          href="/admin/ads/new"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          + New Ad Slot
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No ad slots configured yet.
                </td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ad.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{ad.position}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        ad.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ad.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 italic">
                    Edit support – Phase 8 extension
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Available Positions Reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-2">Available Ad Positions</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(AdPosition).map((pos) => (
            <span key={pos} className="text-xs font-mono bg-white border border-gray-300 px-2 py-1 rounded">
              {pos}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
