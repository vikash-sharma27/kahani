'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { SubmissionStatus, StoryStatus } from '@prisma/client';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { getUniqueStorySlug } from '@/lib/slug';
import { calculateReadingTime } from '@/lib/utils';

export async function updateSubmissionStatusAction(
  id: string,
  status: SubmissionStatus,
  adminNote?: string
): Promise<void> {
  const session = await requireAuth();

  await db.storySubmission.update({
    where: { id },
    data: { status, adminNote: adminNote || null },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: `SUBMISSION_${status}`,
      entity: 'SUBMISSION',
      entityId: id,
    },
  });

  revalidatePath('/admin/submissions');
}

export async function approveAndPublishSubmissionAction(id: string): Promise<void> {
  const session = await requireAuth();

  const submission = await db.storySubmission.findUnique({ where: { id } });
  if (!submission) {
    redirect('/admin/submissions?error=NOT_FOUND');
  }

  // Find first available category or default
  const firstCategory = await db.category.findFirst({ orderBy: { sortOrder: 'asc' } });
  if (!firstCategory) {
    redirect('/admin/submissions?error=NO_CATEGORIES');
  }

  const sanitizedContent = sanitizeStoryContent(submission.content);
  const slug = await getUniqueStorySlug(submission.title);
  const readingTimeMin = calculateReadingTime(sanitizedContent);

  try {
    await db.story.create({
      data: {
        title: submission.title,
        slug,
        excerpt: submission.content.slice(0, 200).replace(/\s+/g, ' ').trim() + '...',
        content: sanitizedContent,
        authorName: submission.name,
        categoryId: firstCategory.id,
        status: StoryStatus.PUBLISHED,
        publishedAt: new Date(),
        adultContentConfirmed: true,
        readingTimeMin,
      },
    });

    await db.storySubmission.update({
      where: { id },
      data: { status: SubmissionStatus.APPROVED },
    });

    await db.auditLog.create({
      data: {
        actorId: session.userId,
        action: 'SUBMISSION_APPROVED_AND_PUBLISHED',
        entity: 'SUBMISSION',
        entityId: id,
        metadata: { title: submission.title, slug },
      },
    });
  } catch (err) {
    console.error('Failed to approve and publish submission:', err);
    redirect('/admin/submissions?error=PUBLISH_FAILED');
  }

  revalidatePath('/');
  revalidatePath('/admin/submissions');
  redirect('/admin/submissions?success=APPROVED');
}
