import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kahaninest.com';

export const metadata: Metadata = {
  title: 'अपनी कहानी भेजें (Submit Your Story) | Chut Ki Kahani',
  description:
    'Chut Ki Kahani पर अपनी मौलिक 18+ वयस्क हिंदी एवं हिंग्लिश कहानी सबमिट करें। लेखक समुदाय से जुड़ें और अपनी रचना लाखों पाठकों तक पहुँचाएँ।',
  alternates: { canonical: `${baseUrl}/submit-story` },
  openGraph: {
    title: 'अपनी कहानी भेजें (Submit Your Story) | Chut Ki Kahani',
    description: 'Chut Ki Kahani पर अपनी मौलिक हिंदी या हिंग्लिश कहानी प्रकाशित करवाएं।',
    url: `${baseUrl}/submit-story`,
    siteName: 'Chut Ki Kahani',
    images: [{ url: `${baseUrl}/logo.png`, width: 600, height: 200, alt: 'Chut Ki Kahani Submit Story' }],
  },
};

export default function SubmitStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
