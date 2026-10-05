import React from 'react';
import type { Metadata } from 'next';
import { AgeGateModal } from '@/components/age-gate/AgeGateModal';

export const metadata: Metadata = {
  title: 'आयु सत्यापन (Age Verification - 18+)',
  description: '18 वर्ष या उससे अधिक आयु के वयस्कों के लिए सत्यापन।',
  robots: {
    index: false,
    follow: false,
  },
};

interface AgeGatePageProps {
  searchParams: {
    returnTo?: string;
  };
}

export default function AgeGatePage({ searchParams }: AgeGatePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AgeGateModal returnTo={searchParams?.returnTo || '/'} isOverlay={false} />
    </div>
  );
}
