'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function createTeamUserAction(formData: FormData): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  const email = (formData.get('email') as string) || '';
  const name = (formData.get('name') as string) || '';
  const password = (formData.get('password') as string) || '';
  const role = (formData.get('role') as Role) || Role.EDITOR;

  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters long');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await db.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'CREATE_USER',
      entity: 'USER',
      entityId: user.id,
      metadata: { email, role },
    },
  });

  revalidatePath('/admin/users');
}

export async function toggleUserBanAction(userId: string, currentBanStatus: boolean): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  // Prevent admin from banning self
  if (userId === session.userId) {
    throw new Error('You cannot ban your own account');
  }

  await db.user.update({
    where: { id: userId },
    data: { isBanned: !currentBanStatus },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: currentBanStatus ? 'UNBAN_USER' : 'BAN_USER',
      entity: 'USER',
      entityId: userId,
    },
  });

  revalidatePath('/admin/users');
}
