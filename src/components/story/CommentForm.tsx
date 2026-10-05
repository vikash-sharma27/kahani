'use client';

import React, { useState, useTransition } from 'react';
import { submitCommentAction } from '@/server/actions/comment-public';

interface CommentFormProps {
  storyId: string;
  storySlug: string;
}

export function CommentForm({ storyId, storySlug }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [body, setBody] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setResult(null);

    startTransition(async () => {
      const res = await submitCommentAction(storyId, storySlug, formData);
      setResult(res);
      if (res.success) {
        setDisplayName('');
        setBody('');
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-rose-100 border-b-4 border-b-rose-200/80 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#201a24] to-[#322336] text-white px-4 py-2.5 flex items-center gap-2">
        <span className="text-sm">💬</span>
        <span className="font-bold text-sm font-devanagari">टिप्पणी लिखें (Comment)</span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Success message */}
        {result?.success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-xs font-devanagari flex items-start gap-2">
            <span className="text-lg mt-0.5">✅</span>
            <div>
              <p className="font-bold">टिप्पणी सबमिट हो गई!</p>
              <p className="mt-0.5 text-green-700">{result.message}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {result && !result.success && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg px-4 py-3 text-xs font-devanagari flex items-start gap-2">
            <span className="text-lg mt-0.5">⚠️</span>
            <p>{result.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 font-devanagari mb-1">
              आपका नाम <span className="text-[#b8233e]">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="जैसे: रोहन, अनामिका, Priya..."
              maxLength={50}
              required
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#b8233e] font-devanagari bg-rose-50/20 transition-colors"
            />
          </div>

          {/* Comment body */}
          <div>
            <label className="block text-xs font-bold text-gray-700 font-devanagari mb-1">
              टिप्पणी <span className="text-[#b8233e]">*</span>
            </label>
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="इस कहानी के बारे में अपने विचार लिखें... (कम से कम 10 अक्षर)"
              rows={4}
              maxLength={1000}
              required
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#b8233e] font-devanagari bg-rose-50/20 resize-none transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right font-mono">
              {body.length}/1000
            </p>
          </div>

          {/* 18+ confirmation */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-3.5 h-3.5 accent-[#b8233e] flex-shrink-0"
            />
            <span className="text-[10px] text-gray-500 font-devanagari leading-relaxed">
              मैं पुष्टि करता/करती हूँ कि मेरी आयु 18 वर्ष या उससे अधिक है और यह टिप्पणी शालीन एवं मूल है।
            </span>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="btn-3d w-full py-2.5 bg-gradient-to-r from-[#b8233e] to-[#91152a] hover:from-[#cb2846] hover:to-[#a21931] text-white font-bold text-xs rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed font-devanagari"
          >
            {isPending ? '⏳ सबमिट हो रहा है...' : '💬 टिप्पणी सबमिट करें'}
          </button>

          <p className="text-[10px] text-center text-gray-400 font-devanagari">
            टिप्पणियाँ समीक्षा के बाद प्रकाशित होती हैं। अनुचित सामग्री हटा दी जाएगी।
          </p>
        </form>
      </div>
    </div>
  );
}
