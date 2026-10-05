import React from 'react';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createCategoryAction, deleteCategoryAction } from '@/server/actions/category';

export const metadata: Metadata = { title: 'Categories Management | Admin' };

export default async function AdminCategoriesPage() {
  const session = await requireAuth();
  const isAdmin = session.role === 'ADMIN';

  const categories = await db.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { stories: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
          श्रेणियाँ प्रबंधन (Categories Management)
        </h1>
        <p className="text-xs text-gray-500">
          कहानियों की श्रेणियाँ व्यवस्थित करें (छवि रहित, केवल CSS रंग टोकन)
        </p>
      </div>

      {/* Add New Category Form (Admin only) */}
      {isAdmin && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-devanagari">
            + नई श्रेणी जोड़ें (Add New Category)
          </h2>

          <form action={createCategoryAction} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                नाम (Name) *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="रोमांस / Romance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Slug (वैकल्पिक)
              </label>
              <input
                type="text"
                name="slug"
                placeholder="romance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                CSS Colour Token
              </label>
              <select
                name="colour"
                defaultValue="rose"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="rose">Rose (लाल/गुलाबी)</option>
                <option value="amber">Amber (पीला/नारंगी)</option>
                <option value="blue">Blue (नीला)</option>
                <option value="purple">Purple (बैंगनी)</option>
                <option value="indigo">Indigo (गहरा नीला)</option>
                <option value="emerald">Emerald (हरा)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                विवरण (Description)
              </label>
              <input
                type="text"
                name="description"
                placeholder="संक्षिप्त परिचय..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                क्रम (Sort Order)
              </label>
              <input
                type="number"
                name="sortOrder"
                defaultValue={categories.length + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
              >
                श्रेणी सहेजें (Save Category)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-3">रंग</th>
              <th className="px-4 py-3">नाम (Name)</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">कुल कहानियाँ</th>
              <th className="px-4 py-3">क्रम</th>
              <th className="px-4 py-3 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="w-4 h-4 rounded-full inline-block border border-gray-300 bg-red-500" />
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 font-devanagari">
                  {cat.name}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-xs font-semibold">
                  {cat._count.stories} कहानियाँ
                </td>
                <td className="px-4 py-3 text-xs">{cat.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  {isAdmin && cat._count.stories === 0 ? (
                    <form
                      action={deleteCategoryAction.bind(null, cat.id)}
                      className="inline-block"
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
                      >
                        हटाएं (Del)
                      </button>
                    </form>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      {cat._count.stories > 0 ? 'उपयोग में (In use)' : '-'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
