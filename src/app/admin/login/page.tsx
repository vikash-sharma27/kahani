'use client';

import React from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginAdmin, type AuthActionResult } from '@/server/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<AuthActionResult | null, FormData>(
    loginAdmin,
    null
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded mb-2">
            Internal Staff Only
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            टीम लॉगिन (Team Portal)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access restricted to verified Editors and Administrators
          </p>
        </div>

        {state?.error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="editor@storynest.internal"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs text-red-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              minLength={12}
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-900">
            ← Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
