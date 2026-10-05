'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashIp } from '@/lib/security';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { checkRateLimit } from '@/lib/rate-limit';

const submissionSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  title: z.string().min(5).max(200),
  content: z.string().min(200).max(50000),
  requestedCategory: z.string().min(2),
  adultConfirmed: z.literal('true'),
});

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export async function submitStoryAction(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const headersList = headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    '127.0.0.1';

  // Rate limit: 3 submissions per hour per IP
  const rl = checkRateLimit(`submit:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return { success: false, error: 'बहुत अधिक अनुरोध। कृपया 1 घंटे बाद पुनः प्रयास करें।' };
  }

  const cookieStore = cookies();
  const deviceId = cookieStore.get('device_id')?.value || 'unknown';

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    title: formData.get('title'),
    content: formData.get('content'),
    requestedCategory: formData.get('requestedCategory'),
    adultConfirmed: formData.get('adultConfirmed') === 'on' ? 'true' : formData.get('adultConfirmed'),
  };

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
  }

  const sanitizedContent = sanitizeStoryContent(parsed.data.content);

  await db.storySubmission.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      title: parsed.data.title,
      content: sanitizedContent,
      requestedCategory: parsed.data.requestedCategory,
      ipHash: hashIp(ip),
      deviceId,
    },
  });

  redirect('/submit-story/success');
}
