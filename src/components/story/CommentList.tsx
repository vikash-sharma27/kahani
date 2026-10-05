import React from 'react';
import { db } from '@/lib/db';
import { CommentStatus } from '@prisma/client';
import { formatDate } from '@/lib/utils';

interface CommentListProps {
  storyId: string;
}

export async function CommentList({ storyId }: CommentListProps) {
  const comments = await db.comment.findMany({
    where: {
      storyId,
      status: CommentStatus.APPROVED,
      parentId: null, // Only top-level comments
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      displayName: true,
      body: true,
      createdAt: true,
    },
  });

  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 shadow-2xs overflow-hidden">
        <div className="bg-gradient-to-r from-[#b8233e] to-[#91152a] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">💬</span>
            <span className="font-bold text-sm font-devanagari">पाठक टिप्पणियाँ</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">0</span>
        </div>
        <div className="p-6 text-center text-gray-400 text-xs font-devanagari">
          <p className="text-2xl mb-2">💭</p>
          <p>अभी तक कोई टिप्पणी नहीं है।</p>
          <p className="text-[10px] mt-1 text-gray-300">पहली टिप्पणी लिखने वाले बनें!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#b8233e] to-[#91152a] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">💬</span>
          <span className="font-bold text-sm font-devanagari">पाठक टिप्पणियाँ</span>
        </div>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">
          {comments.length}
        </span>
      </div>

      {/* Comments list */}
      <div className="divide-y divide-rose-50/60">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 hover:bg-rose-50/20 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              {/* Avatar initial */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b8233e] to-[#91152a] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {comment.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-800 font-devanagari">
                  {comment.displayName}
                </span>
                <span className="text-[10px] text-gray-400 ml-2 font-mono">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-700 font-devanagari leading-relaxed pl-9">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
