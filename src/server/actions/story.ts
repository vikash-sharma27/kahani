'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { calculateReadingTime } from '@/lib/utils';
import { getUniqueStorySlug } from '@/lib/slug';
import { StoryStatus } from '@prisma/client';

export async function createStoryAction(formData: FormData) {
  const session = await requireAuth();

  const title = ((formData.get('title') as string) || '').trim();
  const slugInput = ((formData.get('slug') as string) || '').trim();
  const excerpt = ((formData.get('excerpt') as string) || '').trim();
  const content = ((formData.get('content') as string) || '').trim();
  const authorName = ((formData.get('authorName') as string) || '').trim();
  const categoryId = ((formData.get('categoryId') as string) || '').trim();
  const status = (formData.get('status') as StoryStatus) || StoryStatus.DRAFT;
  const adultConfirmed = formData.get('adultContentConfirmed') === 'true' || formData.get('adultContentConfirmed') === 'on';
  const scheduledAtStr = formData.get('scheduledAt') as string | null;
  const seoTitle = (formData.get('seoTitle') as string | null)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string | null)?.trim() || null;

  if (!title || !content || !categoryId) {
    redirect('/admin/stories/new?error=REQUIRED_FIELDS');
  }

  // STRICT RULE: Cannot publish or schedule without 18+ adultContentConfirmed
  if ((status === StoryStatus.PUBLISHED || status === StoryStatus.SCHEDULED) && !adultConfirmed) {
    redirect('/admin/stories/new?error=ADULT_CONFIRMATION_REQUIRED');
  }

  const sanitizedContent = sanitizeStoryContent(content);
  const readingTimeMin = calculateReadingTime(sanitizedContent);
  const finalSlug = await getUniqueStorySlug(slugInput || title);

  try {
    const story = await db.story.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content: sanitizedContent,
        authorName: authorName || 'Antarvasna Team',
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
        metadata: { title, status, slug: finalSlug },
      },
    });
  } catch (err) {
    console.error('Failed to create story:', err);
    redirect('/admin/stories/new?error=CREATE_FAILED');
  }

  revalidatePath('/');
  revalidatePath('/admin/stories');
  redirect('/admin/stories?success=CREATED');
}

export async function updateStoryAction(id: string, formData: FormData) {
  const session = await requireAuth();

  const title = ((formData.get('title') as string) || '').trim();
  const slugInput = ((formData.get('slug') as string) || '').trim();
  const excerpt = ((formData.get('excerpt') as string) || '').trim();
  const content = ((formData.get('content') as string) || '').trim();
  const authorName = ((formData.get('authorName') as string) || '').trim();
  const categoryId = ((formData.get('categoryId') as string) || '').trim();
  const status = (formData.get('status') as StoryStatus) || StoryStatus.DRAFT;
  const adultConfirmed = formData.get('adultContentConfirmed') === 'true' || formData.get('adultContentConfirmed') === 'on';
  const scheduledAtStr = formData.get('scheduledAt') as string | null;
  const seoTitle = (formData.get('seoTitle') as string | null)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string | null)?.trim() || null;

  if (!title || !content || !categoryId) {
    redirect(`/admin/stories/${id}/edit?error=REQUIRED_FIELDS`);
  }

  // STRICT RULE: Cannot publish without 18+ adultContentConfirmed
  if ((status === StoryStatus.PUBLISHED || status === StoryStatus.SCHEDULED) && !adultConfirmed) {
    redirect(`/admin/stories/${id}/edit?error=ADULT_CONFIRMATION_REQUIRED`);
  }

  const existing = await db.story.findUnique({ where: { id } });
  if (!existing) {
    redirect('/admin/stories?error=NOT_FOUND');
  }

  const sanitizedContent = sanitizeStoryContent(content);
  const readingTimeMin = calculateReadingTime(sanitizedContent);
  const finalSlug = await getUniqueStorySlug(slugInput || title, id);

  try {
    const story = await db.story.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content: sanitizedContent,
        authorName: authorName || existing.authorName,
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
        metadata: { title, status, slug: finalSlug },
      },
    });

    revalidatePath(`/story/${story.slug}`);
  } catch (err) {
    console.error('Failed to update story:', err);
    redirect(`/admin/stories/${id}/edit?error=UPDATE_FAILED`);
  }

  revalidatePath('/');
  revalidatePath('/admin/stories');
  redirect('/admin/stories?success=UPDATED');
}

export async function deleteStoryAction(id: string) {
  const session = await requireAuth();

  try {
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
  } catch (err) {
    console.error('Failed to delete story:', err);
    redirect('/admin/stories?error=DELETE_FAILED');
  }

  revalidatePath('/');
  revalidatePath('/admin/stories');
  redirect('/admin/stories?success=DELETED');
}
