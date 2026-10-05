'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  const adsEnabled = formData.get('adsEnabled') === 'true' || formData.get('adsEnabled') === 'on';
  const commentAutoApprove = formData.get('commentAutoApprove') === 'true' || formData.get('commentAutoApprove') === 'on';
  const maintenanceMode = formData.get('maintenanceMode') === 'true' || formData.get('maintenanceMode') === 'on';
  const siteName = (formData.get('siteName') as string) || 'KahaniNest';

  const updates = [
    { key: 'adsEnabled', value: adsEnabled },
    { key: 'commentAutoApprove', value: commentAutoApprove },
    { key: 'maintenanceMode', value: maintenanceMode },
    { key: 'siteName', value: siteName },
  ];

  for (const item of updates) {
    await db.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: { key: item.key, value: item.value },
    });
  }

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'UPDATE_SETTINGS',
      entity: 'SETTINGS',
      metadata: { adsEnabled, commentAutoApprove, maintenanceMode, siteName },
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/settings');
}
