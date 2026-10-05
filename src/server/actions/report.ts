'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { checkRateLimit } from '@/lib/rate-limit';
import { ReportReason, ReportPriority } from '@prisma/client';

const HIGH_PRIORITY_REASONS: ReportReason[] = [
  ReportReason.UNDERAGE_OR_MINOR,
  ReportReason.NON_CONSENSUAL,
];

const comprehensiveReportSchema = z.object({
  storyId: z.string().optional(),
  commentId: z.string().optional(),
  storyUrl: z.string().url('कृपया एक मान्य URL दर्ज करें (जैसे: https://...)'),
  
  // Complainant Legal Identification
  fullName: z
    .string()
    .min(3, 'कृपया अपना पूरा कानूनी नाम दर्ज करें (कम से कम 3 अक्षर)')
    .max(100),
  email: z.string().email('कृपया एक वैध ईमेल पता दर्ज करें'),
  phone: z
    .string()
    .min(10, 'कृपया 10 अंकों का वैध मोबाइल या फ़ोन नंबर दर्ज करें')
    .max(20),
  address: z
    .string()
    .min(10, 'कृपया अपना पूरा डाक पता (मकान नं, गली/मोहल्ला) दर्ज करें'),
  city: z.string().min(2, 'कृपया अपने शहर का नाम दर्ज करें'),
  state: z.string().min(2, 'कृपया अपने राज्य का नाम दर्ज करें'),
  country: z.string().min(2, 'कृपया अपने देश का नाम दर्ज करें'),
  pincode: z.string().min(4, 'कृपया वैध पिन कोड दर्ज करें'),
  relationship: z
    .string()
    .min(2, 'कृपया सामग्री से अपना संबंध या स्थिति स्पष्ट करें'),
  idProofType: z.string().min(2, 'कृपया पहचान पत्र का प्रकार चुनें'),

  // Violation Details
  reason: z.nativeEnum(ReportReason),
  details: z
    .string()
    .min(30, 'कृपया उल्लंघन का विस्तृत विवरण कम से कम 30 अक्षरों में दर्ज करें'),

  // Legal affirmations
  perjuryAffirmed: z.literal('yes', {
    errorMap: () => ({
      message: 'शपथपूर्वक कानूनी सत्यता की घोषणा (Perjury affirmation) अनिवार्य है',
    }),
  }),
  liabilityAffirmed: z.literal('yes', {
    errorMap: () => ({
      message: 'झूठी रिपोर्ट पर कानूनी उत्तरदायित्व की स्वीकृति अनिवार्य है',
    }),
  }),
  digitalSignature: z
    .string()
    .min(3, 'कृपया अपने पूरे नाम से डिजिटल हस्ताक्षर दर्ज करें'),
});

export interface ReportResult {
  success: boolean;
  error?: string;
}

export async function submitReportAction(
  _prev: ReportResult | null,
  formData: FormData
): Promise<ReportResult> {
  const headersList = headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    '127.0.0.1';

  // Strict rate limit: 3 reports per 30 minutes per IP
  const rl = checkRateLimit(`report:${ip}`, 3, 30 * 60 * 1000);
  if (!rl.allowed) {
    return {
      success: false,
      error: 'अत्यधिक रिपोर्ट प्रयास। कृपया 30 मिनट बाद पुनः प्रयास करें।',
    };
  }

  const raw = {
    storyId: (formData.get('storyId') as string) || undefined,
    commentId: (formData.get('commentId') as string) || undefined,
    storyUrl: (formData.get('storyUrl') as string) || '',
    fullName: (formData.get('fullName') as string) || '',
    email: (formData.get('email') as string) || '',
    phone: (formData.get('phone') as string) || '',
    address: (formData.get('address') as string) || '',
    city: (formData.get('city') as string) || '',
    state: (formData.get('state') as string) || '',
    country: (formData.get('country') as string) || '',
    pincode: (formData.get('pincode') as string) || '',
    relationship: (formData.get('relationship') as string) || '',
    idProofType: (formData.get('idProofType') as string) || '',
    reason: formData.get('reason'),
    details: (formData.get('details') as string) || '',
    perjuryAffirmed: formData.get('perjuryAffirmed') === 'on' ? 'yes' : undefined,
    liabilityAffirmed:
      formData.get('liabilityAffirmed') === 'on' ? 'yes' : undefined,
    digitalSignature: (formData.get('digitalSignature') as string) || '',
  };

  const parsed = comprehensiveReportSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  const priority = HIGH_PRIORITY_REASONS.includes(data.reason)
    ? ReportPriority.HIGH
    : ReportPriority.NORMAL;

  // Format a complete legal dossier for admin records
  const fullLegalDossier = `
=== [कानूनी शिकायतकर्ता पहचान / COMPLAINANT IDENTIFICATION] ===
नाम (Full Name): ${data.fullName}
ईमेल (Email): ${data.email}
फ़ोन (Phone): ${data.phone}
संबोधन / स्थिति (Capacity/Relation): ${data.relationship}
पहचान पत्र प्रकार (ID Type): ${data.idProofType}

=== [डाक पता / PHYSICAL MAILING ADDRESS] ===
पता (Address): ${data.address}
शहर (City): ${data.city} | राज्य (State): ${data.state}
देश (Country): ${data.country} | पिन कोड (PIN): ${data.pincode}

=== [उल्लंघन का विवरण / INFRINGEMENT DETAILS] ===
सामग्री लिंक (Target URL): ${data.storyUrl}
मुख्य कारण (Reason): ${data.reason}
विस्तृत विवरण (Specific Evidence):
${sanitizeStoryContent(data.details)}

=== [कानूनी घोषणा एवं शपथ / LEGAL AFFIRMATIONS] ===
[x] शपथपूर्वक सत्यता घोषणा (Penalty of Perjury): स्वीकृत (Affirmed)
[x] झूठी शिकायत पर हर्जाना दायित्व (Legal Liability): स्वीकृत (Affirmed)
डिजिटल हस्ताक्षर (Digital Signature): ${data.digitalSignature}
सबमिशन IP: ${ip}
दिनांक व समय: ${new Date().toISOString()}
`.trim();

  await db.report.create({
    data: {
      storyId: data.storyId || null,
      commentId: data.commentId || null,
      storyUrl: data.storyUrl || null,
      reason: data.reason,
      details: fullLegalDossier,
      priority,
    },
  });

  redirect('/report/success');
}
