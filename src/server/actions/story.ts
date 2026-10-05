'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { calculateReadingTime } from '@/lib/utils';
import { generateSlug } from '@/lib/slug';
import { StoryStatus } from '@prisma/client';

export async function createStoryAction(formData: FormData) {
  const session = await requireAuth();

  const title = (formData.get('title') as string) || '';
  const slugInput = (formData.get('slug') as string) || '';
  const excerpt = (formData.get('excerpt') as string) || '';
  const content = (formData.get('content') as string) || '';
  const authorName = (formData.get('authorName') as string) || '';
  const categoryId = (formData.get('categoryId') as string) || '';
  const status = (formData.get('status') as StoryStatus) || StoryStatus.DRAFT;
  const adultConfirmed = formData.get('adultContentConfirmed') === 'true' || formData.get('adultContentConfirmed') === 'on';
  const scheduledAtStr = formData.get('scheduledAt') as string | null;
  const seoTitle = formData.get('seoTitle') as string | null;
  const seoDescription = formData.get('seoDescription') as string | null;

  // STRICT RULE: Cannot publish or schedule without 18+ adultContentConfirmed
  if ((status === StoryStatus.PUBLISHED || status === StoryStatus.SCHEDULED) && !adultConfirmed) {
    throw new Error('Mandatory confirmation required: All characters must be adults (18+) and content fictional.');
  }

  const sanitizedContent = sanitizeStoryContent(content);
  const readingTimeMin = calculateReadingTime(sanitizedContent);
  const finalSlug = slugInput ? generateSlug(slugInput) : generateSlug(title);

  const story = await db.story.create({
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content: sanitizedContent,
      authorName,
      categoryId,
      status,
      adultContentConfirmed: adultConfirmed,
      readingTimeMin,
      publishedAt: status === StoryStatus.PUBLISHED ? new Date() : null,
      scheduledAt: scheduledAtStr ? new Date(scheduledAtStr) : null,
      seoTitle,
      seoDescription,
    },
  });

  // Create initial revision snapshot
  await db.storyRevision.create({
    data: {
      storyId: story.id,
      editorId: session.userId,
      contentSnapshot: sanitizedContent,
    },
  });

  // Audit Log
  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'CREATE_STORY',
      entity: 'STORY',
      entityId: story.id,
      metadata: { title, status },
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/stories');
  redirect('/admin/stories');
}

export async function updateStoryAction(id: string, formData: FormData) {
  const session = await requireAuth();

  const title = (formData.get('title') as string) || '';
  const slugInput = (formData.get('slug') as string) || '';
  const excerpt = (formData.get('excerpt') as string) || '';
  const content = (formData.get('content') as string) || '';
  const authorName = (formData.get('authorName') as string) || '';
  const categoryId = (formData.get('categoryId') as string) || '';
  const status = (formData.get('status') as StoryStatus) || StoryStatus.DRAFT;
  const adultConfirmed = formData.get('adultContentConfirmed') === 'true' || formData.get('adultContentConfirmed') === 'on';
  const scheduledAtStr = formData.get('scheduledAt') as string | null;
  const seoTitle = formData.get('seoTitle') as string | null;
  const seoDescription = formData.get('seoDescription') as string | null;

  // STRICT RULE: Cannot publish without 18+ adultContentConfirmed
  if ((status === StoryStatus.PUBLISHED || status === StoryStatus.SCHEDULED) && !adultConfirmed) {
    throw new Error('Mandatory confirmation required: All characters must be adults (18+) and content fictional.');
  }

  const sanitizedContent = sanitizeStoryContent(content);
  const readingTimeMin = calculateReadingTime(sanitizedContent);
  const finalSlug = slugInput ? generateSlug(slugInput) : generateSlug(title);

  const existing = await db.story.findUnique({ where: { id } });
  if (!existing) throw new Error('Story not found');

  const story = await db.story.update({
    where: { id },
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content: sanitizedContent,
      authorName,
      categoryId,
      status,
      adultContentConfirmed: adultConfirmed,
      readingTimeMin,
      publishedAt: status === StoryStatus.PUBLISHED && !existing.publishedAt ? new Date() : existing.publishedAt,
      scheduledAt: scheduledAtStr ? new Date(scheduledAtStr) : null,
      seoTitle,
      seoDescription,
    },
  });

  // Save revision
  await db.storyRevision.create({
    data: {
      storyId: story.id,
      editorId: session.userId,
      contentSnapshot: sanitizedContent,
    },
  });

  // Audit Log
  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'UPDATE_STORY',
      entity: 'STORY',
      entityId: story.id,
      metadata: { title, status },
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/stories');
  revalidatePath(`/story/${story.slug}`);
  redirect('/admin/stories');
}

export async function deleteStoryAction(id: string) {
  const session = await requireAuth();

  const story = await db.story.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'DELETE_STORY',
      entity: 'STORY',
      entityId: id,
      metadata: { title: story.title },
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/stories');
  redirect('/admin/stories');
}
