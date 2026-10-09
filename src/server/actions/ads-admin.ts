'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role, AdPosition } from '@prisma/client';

/** Naya ad create karna */
export async function createAdAction(formData: FormData): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  const name     = ((formData.get('name')     as string) || '').trim();
  const position = (formData.get('position')  as AdPosition);
  const htmlCode = ((formData.get('htmlCode') as string) || '').trim();
  const enabled  = formData.get('enabled') === 'true';

  if (!name)     throw new Error('Ad ka naam zaroori hai.');
  if (!position || !Object.values(AdPosition).includes(position))
    throw new Error('Valid position choose karo.');
  if (!htmlCode) throw new Error('HTML / Script code zaroori hai.');

  const ad = await db.advertisement.create({
    data: { name, position, htmlCode, enabled },
  });

  await db.auditLog.create({
    data: {
      actorId:  session.userId,
      action:   'CREATE_AD',
      entity:   'ADVERTISEMENT',
      entityId: ad.id,
      metadata: { name, position, enabled },
    },
  });

  revalidatePath('/admin/ads');
  redirect('/admin/ads');
}

/** Ad ka status toggle karna (enable / disable) */
export async function toggleAdAction(adId: string, currentEnabled: boolean): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  await db.advertisement.update({
    where: { id: adId },
    data:  { enabled: !currentEnabled },
  });

  await db.auditLog.create({
    data: {
      actorId:  session.userId,
      action:   currentEnabled ? 'DISABLE_AD' : 'ENABLE_AD',
      entity:   'ADVERTISEMENT',
      entityId: adId,
    },
  });

  revalidatePath('/admin/ads');
}

/** Ad delete karna */
export async function deleteAdAction(adId: string): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  await db.advertisement.delete({ where: { id: adId } });

  await db.auditLog.create({
    data: {
      actorId:  session.userId,
      action:   'DELETE_AD',
      entity:   'ADVERTISEMENT',
      entityId: adId,
    },
  });

  revalidatePath('/admin/ads');
}
