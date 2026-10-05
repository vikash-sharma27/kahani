import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  updateReportStatusAction,
  unpublishStoryFromReportAction,
} from '@/server/actions/report-admin';
import { formatDate } from '@/lib/utils';
import { ReportStatus, ReportPriority } from '@prisma/client';

export const metadata: Metadata = { title: 'Reports & Takedowns | Admin' };

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAuth();

  const statusFilter =
    searchParams?.status && Object.values(ReportStatus).includes(searchParams.status as ReportStatus)
      ? (searchParams.status as ReportStatus)
      : ReportStatus.OPEN;

  const reports = await db.report.findMany({
    where: { status: statusFilter },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    include: {
      story: { select: { id: true, title: true, slug: true, status: true } },
      comment: { select: { id: true, body: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            सामग्री रिपोर्ट एवं टेकडाउन (Reports &amp; Takedowns)
          </h1>
          <p className="text-xs text-gray-500">
            {reports.length} reports ({statusFilter})
          </p>
        </div>

        <div className="flex gap-2 text-xs font-semibold">
          {Object.values(ReportStatus).map((s) => (
            <a
              key={s}
              href={`/admin/reports?status=${s}`}
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm font-devanagari">
            कोई खुली रिपोर्ट नहीं है।
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className={`p-5 transition-colors ${
                  rep.priority === ReportPriority.HIGH ? 'bg-red-50/40' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      {rep.priority === ReportPriority.HIGH && (
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider animate-pulse">
                          HIGH PRIORITY
                        </span>
                      )}
                      <span className="font-semibold text-gray-800">
                        कारण: {rep.reason}
                      </span>
                      <span>•</span>
                      <span className="text-gray-500">{formatDate(rep.createdAt)}</span>
                    </div>

                    {rep.story && (
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        कहानी:{' '}
                        <a
                          href={`/story/${rep.story.slug}`}
                          target="_blank"
                          className="text-red-600 underline"
                        >
                          {rep.story.title}
                        </a>{' '}
                        <span className="text-xs font-mono font-normal text-gray-500">
                          ({rep.story.status})
                        </span>
                      </p>
                    )}

                    {rep.storyUrl && (
                      <p className="text-xs text-gray-500 font-mono mb-1">
                        URL: {rep.storyUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {rep.story && rep.story.status !== 'ARCHIVED' && (
                      <form
                        action={unpublishStoryFromReportAction.bind(null, rep.id, rep.story.id)}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          कहानी अप्रकाशित करें (Unpublish)
                        </button>
                      </form>
                    )}

                    <form
                      action={updateReportStatusAction.bind(null, rep.id, ReportStatus.DISMISSED)}
                    >
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg border border-gray-300"
                      >
                        Dismiss
                      </button>
                    </form>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-gray-800 font-devanagari bg-white p-4 rounded-lg border border-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                  {rep.details}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
