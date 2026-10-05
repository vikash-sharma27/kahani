import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  createPageUrl?: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = '',
  createPageUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getUrl = (p: number) => {
    if (createPageUrl) return createPageUrl(p);
    return p === 1 ? basePath || '/' : `${basePath}?page=${p}`;
  };

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Pagination Navigation" className="w-full my-8">
      {/* Mobile Compact View (Large tap buttons) */}
      <div className="flex sm:hidden items-center justify-between gap-3 w-full">
        {hasPrev ? (
          <Link
            href={getUrl(currentPage - 1)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 active:bg-gray-100"
          >
            ← पिछला (Prev)
          </Link>
        ) : (
          <span className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            ← पिछला
          </span>
        )}

        <span className="text-xs font-semibold text-gray-600 px-2 font-mono">
          {currentPage} / {totalPages}
        </span>

        {hasNext ? (
          <Link
            href={getUrl(currentPage + 1)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 active:bg-gray-100"
          >
            अगला (Next) →
          </Link>
        ) : (
          <span className="flex-1 min-h-[44px] inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            अगला →
          </span>
        )}
      </div>

      {/* Desktop View with numbered links */}
      <div className="hidden sm:flex items-center justify-center gap-1.5">
        {hasPrev && (
          <Link
            href={getUrl(currentPage - 1)}
            className="min-h-[40px] px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Previous Page"
          >
            ← Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          // Show first, last, current, and neighbours
          if (
            p === 1 ||
            p === totalPages ||
            (p >= currentPage - 2 && p <= currentPage + 2)
          ) {
            const isCurrent = p === currentPage;
            return isCurrent ? (
              <span
                key={p}
                aria-current="page"
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center border border-red-600 bg-red-600 text-white rounded-lg text-sm font-bold"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={getUrl(p)}
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium"
              >
                {p}
              </Link>
            );
          } else if (p === currentPage - 3 || p === currentPage + 3) {
            return (
              <span key={p} className="px-2 text-gray-400 select-none">
                ...
              </span>
            );
          }
          return null;
        })}

        {hasNext && (
          <Link
            href={getUrl(currentPage + 1)}
            className="min-h-[40px] px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Next Page"
          >
            Next →
          </Link>
        )}
      </div>
    </nav>
  );
}
