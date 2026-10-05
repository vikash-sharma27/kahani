'use client';

import React, { useEffect } from 'react';
import { ErrorState } from '@/components/ui/EmptyState';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorState
          title="त्रुटि उत्पन्न हुई (Application Error)"
          message="सर्वर पर इस पृष्ठ को लोड करने में कोई तकनीकी समस्या आई है।"
          onRetry={reset}
        />
      </div>
    </div>
  );
}
