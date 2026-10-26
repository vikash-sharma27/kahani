import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { deleteStoryAction } from '@/server/actions/story';
import { formatDate } from '@/lib/utils';
import { StoryStatus } from '@prisma/client';

export default async function AdminStoriesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; search?: string; error?: string; success?: string };
}) {
  await requireAuth();

  const successMessage =
    searchParams?.success === 'CREATED'
      ? 'नई कहानी सफलतापूर्वक प्रकाशित / सुरक्षित कर दी गई!'
      : searchParams?.success === 'UPDATED'
      ? 'कहानी में बदलाव सफलतापूर्वक सुरक्षित किए गए!'
      : searchParams?.success === 'DELETED'
      ? 'कहानी सफलतापूर्वक हटा दी गई!'
      : null;

  const errorMessage =
    searchParams?.error === 'NOT_FOUND'
      ? 'कहानी नहीं मिली।'
      : searchParams?.error === 'DELETE_FAILED'
      ? 'कहानी हटाने में कोई त्रुटि आई।'
      : null;

  const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
  const perPage = 15;
  const skip = (page - 1) * perPage;

  const where: {
    status?: StoryStatus;
    title?: { contains: string; mode: 'insensitive' };
  } = {};

  if (searchParams?.status && Object.values(StoryStatus).includes(searchParams.status as StoryStatus)) {
    where.status = searchParams.status as StoryStatus;
  }

  if (searchParams?.search) {
    where.title = { contains: searchParams.search, mode: 'insensitive' };
  }

  const [total, stories] = await Promise.all([
    db.story.count({ where }),
    db.story.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            कहानियाँ प्रबंधन (Stories CMS)
          </h1>
          <p className="text-xs text-gray-500">
            Total {total} stories found • Page {page} of {totalPages}
          </p>
        </div>

        <Link
          href="/admin/stories/new"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors font-devanagari"
        >
          + नई कहानी जोड़ें (New Story)
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <form method="GET" className="flex flex-wrap gap-2 items-center flex-1">
          <input
            type="text"
            name="search"
            defaultValue={searchParams?.search || ''}
            placeholder="कहानी शीर्षक खोजें..."
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm flex-1 min-w-[200px]"
          />

          <select
            name="status"
            defaultValue={searchParams?.status || ''}
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">सभी स्टेटस (All Status)</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg"
          >
            फ़िल्टर करें
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-3">शीर्षक (Title)</th>
                <th className="px-4 py-3">श्रेणी (Category)</th>
                <th className="px-4 py-3">लेखक (Author)</th>
                <th className="px-4 py-3">स्थिति (Status)</th>
                <th className="px-4 py-3">व्यूज / लाइक्स</th>
                <th className="px-4 py-3">दिनांक</th>
                <th className="px-4 py-3 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 font-devanagari">
                    कोई कहानी नहीं मिली
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-900 font-devanagari max-w-[250px] truncate">
                      <Link href={`/story/${story.slug}`} target="_blank" className="hover:text-red-600 underline">
                        {story.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                        {story.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-devanagari text-xs">{story.authorName}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          story.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : story.status === 'DRAFT'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {story.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      {story.viewCount} / {story.likeCount}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {formatDate(story.publishedAt || story.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-3">
                      <Link
                        href={`/admin/stories/${story.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      >
                        संपादित करें (Edit)
                      </Link>
                      <form
                        action={deleteStoryAction.bind(null, story.id)}
                        className="inline-block"
                      >
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800 text-xs font-semibold"
                        >
                          हटाएं (Del)
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
