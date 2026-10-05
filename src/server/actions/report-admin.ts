'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { ReportStatus, StoryStatus } from '@prisma/client';

export async function updateReportStatusAction(
  reportId: string,
  status: ReportStatus
): Promise<void> {
  const session = await requireAuth();

  await db.report.update({
    where: { id: reportId },
    data: { status },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: `REPORT_${status}`,
      entity: 'REPORT',
      entityId: reportId,
    },
  });

  revalidatePath('/admin/reports');
}

export async function unpublishStoryFromReportAction(
  reportId: string,
  storyId: string
): Promise<void> {
  const session = await requireAuth();

  await db.story.update({
    where: { id: storyId },
    data: { status: StoryStatus.ARCHIVED },
  });

  await db.report.update({
    where: { id: reportId },
    data: { status: ReportStatus.ACTIONED },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'STORY_UNPUBLISHED_VIA_REPORT',
      entity: 'STORY',
      entityId: storyId,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/reports');
  revalidatePath('/admin/stories');
}
