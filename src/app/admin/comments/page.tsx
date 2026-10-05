import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { moderateCommentAction } from '@/server/actions/comment-admin';
import { formatDate } from '@/lib/utils';
import { CommentStatus } from '@prisma/client';

export const metadata: Metadata = { title: 'Comments Moderation | Admin' };

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  await requireAuth();

  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const perPage = 20;
  const skip = (page - 1) * perPage;

  const statusFilter =
    searchParams?.status && Object.values(CommentStatus).includes(searchParams.status as CommentStatus)
      ? (searchParams.status as CommentStatus)
      : CommentStatus.PENDING;

  const [total, comments] = await Promise.all([
    db.comment.count({ where: { status: statusFilter } }),
    db.comment.findMany({
      where: { status: statusFilter },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: { story: { select: { title: true, slug: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments Moderation</h1>
          <p className="text-xs text-gray-500">
            {total} comments ({statusFilter}) — Page {page}/{totalPages}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 text-xs font-semibold">
          {Object.values(CommentStatus).map((s) => (
            <a
              key={s}
              href={`/admin/comments?status=${s}`}
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
        <div className="divide-y divide-gray-100">
          {comments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No comments with status &ldquo;{statusFilter}&rdquo;.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-gray-700">
                        {comment.displayName}
                      </span>
                      <span>•</span>
                      <span>{formatDate(comment.createdAt)}</span>
                      <span>•</span>
                      <a
                        href={`/story/${comment.story.slug}`}
                        className="text-red-600 hover:underline truncate max-w-[180px]"
                        target="_blank"
                      >
                        {comment.story.title}
                      </a>
                    </div>
                    <p className="text-sm text-gray-800 font-devanagari leading-relaxed">
                      {comment.body}
                    </p>
                  </div>

                  {/* Moderation Buttons */}
                  {statusFilter === CommentStatus.PENDING && (
                    <div className="flex gap-2 flex-shrink-0">
                      <form
                        action={moderateCommentAction.bind(null, comment.id, 'approve')}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold rounded-lg"
                        >
                          ✓ Approve
                        </button>
                      </form>
                      <form
                        action={moderateCommentAction.bind(null, comment.id, 'reject')}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                        >
                          Reject
                        </button>
                      </form>
                      <form
                        action={moderateCommentAction.bind(null, comment.id, 'spam')}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg"
                        >
                          Spam
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Simple pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center text-sm">
          {page > 1 && (
            <a
              href={`/admin/comments?status=${statusFilter}&page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg min-h-[44px] flex items-center"
            >
              ← Prev
            </a>
          )}
          <span className="px-4 py-2 text-gray-500 flex items-center">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/comments?status=${statusFilter}&page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg min-h-[44px] flex items-center"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
