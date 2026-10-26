import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  updateSubmissionStatusAction,
  approveAndPublishSubmissionAction,
} from '@/server/actions/submission-admin';
import { formatDate } from '@/lib/utils';
import { SubmissionStatus } from '@prisma/client';

export const metadata: Metadata = { title: 'Submissions Moderation | Admin' };

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; error?: string; success?: string };
}) {
  await requireAuth();

  const errorMessageMap: Record<string, string> = {
    NOT_FOUND: 'प्रस्तुति नहीं मिली।',
    NO_CATEGORIES: 'कहानी प्रकाशित करने से पहले कम से कम एक श्रेणी बनाना आवश्यक है।',
    PUBLISH_FAILED: 'कहानी प्रकाशित करने में समस्या आई। कृपया पुनः प्रयास करें।',
  };

  const errorMessage = searchParams?.error ? errorMessageMap[searchParams.error] || 'अनुरोध विफल रहा।' : null;
  const isApprovedSuccess = searchParams?.success === 'APPROVED';

  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const perPage = 15;
  const skip = (page - 1) * perPage;

  const statusFilter =
    searchParams?.status && Object.values(SubmissionStatus).includes(searchParams.status as SubmissionStatus)
      ? (searchParams.status as SubmissionStatus)
      : SubmissionStatus.PENDING;

  const [total, submissions] = await Promise.all([
    db.storySubmission.count({ where: { status: statusFilter } }),
    db.storySubmission.findMany({
      where: { status: statusFilter },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            कहानी प्रस्तुतियाँ (Story Submissions)
          </h1>
          <p className="text-xs text-gray-500">
            Total {total} submissions ({statusFilter}) — Page {page} of {totalPages}
          </p>
        </div>

        <div className="flex gap-2 text-xs font-semibold">
          {Object.values(SubmissionStatus).map((s) => (
            <a
              key={s}
              href={`/admin/submissions?status=${s}`}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                statusFilter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {isApprovedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>✅</span>
          <span>कहानी सफलतापूर्वक स्वीकृत एवं प्रकाशित कर दी गई है!</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {submissions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm font-devanagari">
            कोई प्रस्तुति नहीं मिली।
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-gray-900 font-devanagari">
                        लेखक: {sub.name}
                      </span>
                      <span>•</span>
                      <span>ईमेल: {sub.email}</span>
                      <span>•</span>
                      <span>श्रेणी: {sub.requestedCategory}</span>
                      <span>•</span>
                      <span>{formatDate(sub.createdAt)}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 font-devanagari">
                      {sub.title}
                    </h2>
                  </div>

                  {statusFilter === SubmissionStatus.PENDING && (
                    <div className="flex gap-2 flex-shrink-0">
                      <form action={approveAndPublishSubmissionAction.bind(null, sub.id)}>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-sm font-devanagari"
                        >
                          ✓ स्वीकृत एवं प्रकाशित करें
                        </button>
                      </form>

                      <form
                        action={updateSubmissionStatusAction.bind(
                          null,
                          sub.id,
                          SubmissionStatus.REJECTED,
                          'Rejected by editor'
                        )}
                      >
                        <button
                          type="submit"
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200"
                        >
                          ✕ अस्वीकृत करें
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <div className="mt-3 p-3.5 bg-gray-50 rounded-lg text-sm text-gray-700 font-devanagari whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200">
                  {sub.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
