'use client';

import React from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { requestPasswordReset, type AuthActionResult } from '@/server/actions/auth';

export default function AdminForgotPasswordPage() {
  const [state, formAction] = useFormState<AuthActionResult | null, FormData>(
    requestPasswordReset,
    null
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            पासवर्ड रीसेट (Reset Password)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter your team email to receive a single-use 1-hour reset token
          </p>
        </div>

        {state?.success ? (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
            If an active team account matches that email, a password reset link has been dispatched.
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Account Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@storynest.internal"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-900">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
