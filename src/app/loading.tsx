import React from 'react';
import { Skeleton } from '@/components/ui/EmptyState';

export default function Loading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-white">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-2 flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
