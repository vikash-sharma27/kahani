import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'सामग्री रिपोर्ट एवं टेकडाउन (Report Abuse / Legal Notice) | KahaniNest',
  description:
    'KahaniNest पर नियमों के उल्लंघन, कॉपीराइट या बाल सुरक्षा से संबंधित सामग्री की औपचारिक रिपोर्ट एवं टेकडाउन नोटिस दर्ज करें।',
  alternates: { canonical: `${baseUrl}/report` },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
