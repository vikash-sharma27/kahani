import React from 'react';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateStoryAction } from '@/server/actions/story';
import Link from 'next/link';

interface EditStoryPageProps {
  params: { id: string };
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  await requireAuth();

  const [story, categories] = await Promise.all([
    db.story.findUnique({
      where: { id: params.id },
    }),
    db.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!story) {
    notFound();
  }

  const updateActionWithId = updateStoryAction.bind(null, story.id);

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            कहानी संपादित करें (Edit Story)
          </h1>
          <p className="text-xs text-gray-500">
            TEXT-ONLY story. No cover images, no uploads.
          </p>
        </div>

        <Link
          href="/admin/stories"
          className="text-xs text-gray-600 hover:text-gray-900 font-medium"
        >
          ← वापस कहानियों की सूची पर जाएँ
        </Link>
      </div>

      <form action={updateActionWithId} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
            कहानी का शीर्षक (Title) *
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={story.title}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari"
          />
        </div>

        {/* Slug & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Custom Slug
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={story.slug}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              लेखक का नाम (Author / Pen Name) *
            </label>
            <input
              type="text"
              name="authorName"
              required
              defaultValue={story.authorName}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari"
            />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
              श्रेणी (Category) *
            </label>
            <select
              name="categoryId"
              required
              defaultValue={story.categoryId}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              प्रकाशन स्थिति (Status)
            </label>
            <select
              name="status"
              defaultValue={story.status}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="DRAFT">ड्राफ्ट (Draft)</option>
              <option value="PUBLISHED">प्रकाशित (Published)</option>
              <option value="SCHEDULED">शेड्यूल करें (Scheduled)</option>
              <option value="ARCHIVED">संग्रहित (Archived)</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
            संक्षिप्त सारांश (Excerpt - 2 पंक्तियाँ कार्ड पर दिखेंगी) *
          </label>
          <textarea
            name="excerpt"
            required
            rows={2}
            defaultValue={story.excerpt}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari"
          />
        </div>

        {/* Content (Textarea / HTML) */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1 font-devanagari">
            कहानी की सामग्री (Story Content - Text Only) *
          </label>
          <p className="text-xs text-gray-400 mb-2">
            आप HTML पैराग्राफ (&lt;p&gt;, &lt;strong&gt;, &lt;em&gt;) या सामान्य टेक्स्ट लिख सकते हैं।
          </p>
          <textarea
            name="content"
            required
            rows={14}
            defaultValue={story.content}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-red-500 focus:outline-none font-devanagari leading-relaxed"
          />
        </div>

        {/* SEO Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              SEO Title (वैकल्पिक)
            </label>
            <input
              type="text"
              name="seoTitle"
              defaultValue={story.seoTitle || ''}
              placeholder="Search engines के लिए शीर्षक..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              SEO Description (वैकल्पिक)
            </label>
            <input
              type="text"
              name="seoDescription"
              defaultValue={story.seoDescription || ''}
              placeholder="Meta description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Scheduled time */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Scheduled Publish Time (यदि स्थिति &apos;SCHEDULED&apos; हो)
          </label>
          <input
            type="datetime-local"
            name="scheduledAt"
            defaultValue={story.scheduledAt ? new Date(story.scheduledAt).toISOString().slice(0, 16) : ''}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
          />
        </div>

        {/* MANDATORY 18+ CHECKBOX */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="adultContentConfirmed"
              value="true"
              defaultChecked={story.adultContentConfirmed}
              className="mt-1 h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-xs sm:text-sm font-bold text-red-900 font-devanagari">
              मैं पुष्टि करता/करती हूँ कि कहानी के सभी पात्र वयस्क (18+) हैं, सभी घटनाएं पूर्णतः काल्पनिक हैं और कोई भी प्रतिबंधित/अवैध सामग्री शामिल नहीं है। (अनिवार्य)
            </span>
          </label>
        </div>

        {/* Submit button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/stories"
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            रद्द करें
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            बदलाव सुरक्षित करें (Update Story)
          </button>
        </div>
      </form>
    </div>
  );
}
