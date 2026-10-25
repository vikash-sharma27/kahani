'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import { resetPasswordAction, type AuthActionResult } from '@/server/actions/auth';

export default function AdminResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [state, formAction] = useFormState<AuthActionResult | null, FormData>(
    resetPasswordAction,
    null
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
            नया पासवर्ड बनाएं (New Password)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            अपने टीम खाते के लिए कम से कम 12 अक्षरों का सुरक्षित पासवर्ड सेट करें
          </p>
        </div>

        {!token ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-devanagari">
            कोई वैध रीसेट टोकन नहीं मिला। कृपया ईमेल में दिए गए लिंक पर फिर से क्लिक करें।
            <div className="mt-3">
              <Link href="/admin/forgot-password" className="text-red-700 font-bold underline">
                नया लिंक प्राप्त करें →
              </Link>
            </div>
          </div>
        ) : state?.success ? (
          <div className="p-5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-devanagari text-center space-y-3">
            <p className="text-lg">🎉 पासवर्ड सफलतापूर्वक बदल दिया गया है!</p>
            <p className="text-xs text-green-700">अब आप अपने नए पासवर्ड के साथ लॉगिन कर सकते हैं।</p>
            <Link
              href="/admin/login"
              className="inline-block mt-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              लॉगिन पृष्ठ पर जाएं (Go to Login) →
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            {state?.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-devanagari">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                नया पासवर्ड (New Password - Min 12 Chars) *
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={12}
                placeholder="कम से कम 12 अक्षर..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                पासवर्ड की पुष्टि करें (Confirm Password) *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={12}
                placeholder="पासवर्ड दोबारा दर्ज करें..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              पासवर्ड सुरक्षित करें (Save Password)
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-900">
            ← लॉगिन पर वापस जाएं (Back to Sign In)
          </Link>
        </div>
      </div>
    </div>
  );
}
