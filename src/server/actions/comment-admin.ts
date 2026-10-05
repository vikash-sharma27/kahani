'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { CommentStatus } from '@prisma/client';

export async function moderateCommentAction(
  commentId: string,
  action: 'approve' | 'reject' | 'spam'
): Promise<void> {
  const session = await requireAuth();

  const statusMap: Record<string, CommentStatus> = {
    approve: CommentStatus.APPROVED,
    reject: CommentStatus.REJECTED,
    spam: CommentStatus.SPAM,
  };

  const newStatus = statusMap[action];
  if (!newStatus) throw new Error('Invalid action');

  const comment = await db.comment.update({
    where: { id: commentId },
    data: { status: newStatus },
    include: { story: { select: { commentCount: true, id: true, slug: true } } },
  });

  // Update commentCount on story
  if (action === 'approve') {
    await db.story.update({
      where: { id: comment.storyId },
      data: { commentCount: { increment: 1 } },
    });
  }

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: `COMMENT_${action.toUpperCase()}`,
      entity: 'COMMENT',
      entityId: commentId,
    },
  });

  revalidatePath('/admin/comments');
  revalidatePath(`/story/${comment.story.slug}`);
}
