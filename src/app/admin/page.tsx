import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'एडमिन डैशबोर्ड (Admin Dashboard)',
};

export default async function AdminDashboardPage() {
  const session = await requireAuth();

  // Load counts safely
  let storiesCount = 0;
  let categoriesCount = 0;
  let reportsCount = 0;
  let submissionsCount = 0;

  try {
    [storiesCount, categoriesCount, reportsCount, submissionsCount] = await Promise.all([
      db.story.count(),
      db.category.count(),
      db.report.count({ where: { status: 'OPEN' } }),
      db.storySubmission.count({ where: { status: 'PENDING' } }),
    ]);
  } catch (err) {
    console.error('Error fetching dashboard counts:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            एडमिन डैशबोर्ड (Dashboard)
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {session.name || session.email} ({session.role})
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/stories/new"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            + New Story
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Total Stories
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{storiesCount}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Categories
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{categoriesCount}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Pending Submissions
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{submissionsCount}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Open Reports
          </div>
          <div className="text-3xl font-extrabold text-red-600">{reportsCount}</div>
        </div>
      </div>
    </div>
  );
}
