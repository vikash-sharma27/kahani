import React from 'react';
import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { logoutAdmin } from '@/server/actions/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // If this is an unauthenticated admin page (e.g. login or forgot password), render directly
  if (!session) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-extrabold text-gray-900 text-lg">
              {process.env.SITE_NAME || 'Chut Ki Kahani'}{' '}
              <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-3 text-sm text-gray-600 font-medium">
              <Link href="/admin/stories" className="hover:text-gray-900 px-2 py-1">
                Stories
              </Link>
              <Link href="/admin/categories" className="hover:text-gray-900 px-2 py-1">
                Categories
              </Link>
              <Link href="/admin/comments" className="hover:text-gray-900 px-2 py-1">
                Comments
              </Link>
              <Link href="/admin/submissions" className="hover:text-gray-900 px-2 py-1">
                Submissions
              </Link>
              <Link href="/admin/reports" className="hover:text-gray-900 px-2 py-1">
                Reports
              </Link>
              {session.role === 'ADMIN' && (
                <>
                  <Link href="/admin/users" className="hover:text-gray-900 px-2 py-1">
                    Users
                  </Link>
                  <Link href="/admin/ads" className="hover:text-gray-900 px-2 py-1">
                    Ads
                  </Link>
                  <Link href="/admin/settings" className="hover:text-gray-900 px-2 py-1">
                    Settings
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-right">
              <div className="font-bold text-gray-800">{session.name || session.email}</div>
              <span className="text-[10px] uppercase font-semibold text-gray-500">
                {session.role}
              </span>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
