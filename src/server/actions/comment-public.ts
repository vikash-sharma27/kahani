'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { CommentStatus } from '@prisma/client';
import { headers } from 'next/headers';
import { hashIp } from '@/lib/security';

// Rate limit: max 3 comments per IP per hour
async function checkCommentRateLimit(ipHash: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await db.comment.count({
    where: {
      ipHash,
      createdAt: { gte: oneHourAgo },
    },
  });
  return recentCount < 3;
}

export interface SubmitCommentResult {
  success: boolean;
  message: string;
}

export async function submitCommentAction(
  storyId: string,
  storySlug: string,
  formData: FormData
): Promise<SubmitCommentResult> {
  const displayName = ((formData.get('displayName') as string) || '').trim();
  const body = ((formData.get('body') as string) || '').trim();

  // Basic validation
  if (!displayName || displayName.length < 2 || displayName.length > 50) {
    return { success: false, message: 'नाम 2 से 50 अक्षरों के बीच होना चाहिए।' };
  }
  if (!body || body.length < 10 || body.length > 1000) {
    return { success: false, message: 'टिप्पणी 10 से 1000 अक्षरों के बीच होनी चाहिए।' };
  }

  // Get IP and hash it for privacy
  const headersList = headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';
  const ipHash = hashIp(ip);

  // Rate limit check
  const allowed = await checkCommentRateLimit(ipHash);
  if (!allowed) {
    return {
      success: false,
      message: 'आप बहुत अधिक टिप्पणियाँ कर रहे हैं। कृपया 1 घंटे बाद पुनः प्रयास करें।',
    };
  }

  // Get or create device_id cookie (we use ipHash as deviceId for simplicity)
  const deviceId = ipHash.slice(0, 32);

  // Check story exists
  const story = await db.story.findUnique({
    where: { id: storyId, status: 'PUBLISHED' },
    select: { id: true },
  });
  if (!story) {
    return { success: false, message: 'यह कहानी उपलब्ध नहीं है।' };
  }

  // Create comment (PENDING — admin must approve)
  await db.comment.create({
    data: {
      storyId,
      deviceId,
      displayName,
      body,
      ipHash,
      status: CommentStatus.PENDING,
    },
  });

  revalidatePath(`/story/${storySlug}`);

  return {
    success: true,
    message:
      'आपकी टिप्पणी सफलतापूर्वक सबमिट हो गई! समीक्षा के बाद यह प्रकाशित की जाएगी।',
  };
}

export async function moderateCommentAction(
  commentId: string,
  action: 'approve' | 'reject' | 'spam'
): Promise<void> {
  // Keep existing admin moderation (re-export to avoid breaking admin pages)
  const { moderateCommentAction: adminModerate } = await import('./comment-admin');
  return adminModerate(commentId, action);
}
