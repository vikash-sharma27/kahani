import React from 'react';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { createTeamUserAction, toggleUserBanAction } from '@/server/actions/user-admin';
import { formatDate } from '@/lib/utils';
import { Role } from '@prisma/client';

export const metadata: Metadata = { title: 'Team Accounts | Admin' };

interface AdminUsersPageProps {
  searchParams?: { error?: string; success?: string };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const currentSession = await requireRole(Role.ADMIN);

  const errorMessageMap: Record<string, string> = {
    EMAIL_EXISTS: 'यह ईमेल पहले से किसी टीम सदस्य के खाते में दर्ज है। कृपया दूसरा ईमेल इस्तेमाल करें।',
    PASSWORD_TOO_SHORT: 'पासवर्ड कम से कम 12 अक्षरों का होना अनिवार्य है।',
    INVALID_EMAIL: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    DB_ERROR: 'खाता बनाने में डेटाबेस त्रुटि आई। कृपया पुनः प्रयास करें।',
  };

  const errorMessage = searchParams?.error ? errorMessageMap[searchParams.error] || 'अनुरोध विफल रहा।' : null;
  const isSuccess = Boolean(searchParams?.success);

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
          टीम खाते (Team Accounts)
        </h1>
        <p className="text-xs text-gray-500">
          केवल आंतरिक संपादकों एवं प्रशासकों के खाते (पाठकों के लिए कोई खाता नहीं है)
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-devanagari flex items-center gap-2 shadow-2xs">
          <span>✅</span>
          <span>नया टीम सदस्य सफलतापूर्वक जोड़ दिया गया है!</span>
        </div>
      )}

      {/* Create Team User Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-devanagari">
          + नया टीम सदस्य जोड़ें (Add Team Member)
        </h2>

        <form action={createTeamUserAction} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              नाम (Name)
            </label>
            <input
              type="text"
              name="name"
              placeholder="संपादक नाम"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ईमेल (Email) *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="editor@storynest.internal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              पासवर्ड (Min 12 Chars) *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={12}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              भूमिका (Role)
            </label>
            <select
              name="role"
              defaultValue="EDITOR"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="EDITOR">EDITOR (कहानियाँ व मॉडरेशन)</option>
              <option value="ADMIN">ADMIN (पूर्ण नियंत्रण)</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg text-sm transition-colors"
            >
              खाता बनाएँ (Create Account)
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-3">नाम / ईमेल</th>
              <th className="px-4 py-3">भूमिका (Role)</th>
              <th className="px-4 py-3">अंतिम लॉगिन</th>
              <th className="px-4 py-3">स्थिति (Status)</th>
              <th className="px-4 py-3 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-900">{u.name || 'Unnamed'}</div>
                  <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}
                </td>
                <td className="px-4 py-3">
                  {u.isBanned ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                      BANNED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id !== currentSession.userId ? (
                    <form action={toggleUserBanAction.bind(null, u.id, u.isBanned)}>
                      <button
                        type="submit"
                        className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                          u.isBanned
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {u.isBanned ? 'Unban' : 'Ban Account'}
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs text-gray-400 italic">(आप स्वयं हैं)</span>
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
