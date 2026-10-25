'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function createTeamUserAction(formData: FormData): Promise<void> {
  const session = await requireRole(Role.ADMIN);

  const rawEmail = (formData.get('email') as string) || '';
  const email = rawEmail.toLowerCase().trim();
  const name = ((formData.get('name') as string) || '').trim();
  const password = (formData.get('password') as string) || '';
  const role = (formData.get('role') as Role) || Role.EDITOR;

  if (!email || !email.includes('@')) {
    redirect('/admin/users?error=INVALID_EMAIL');
  }

  if (password.length < 12) {
    redirect('/admin/users?error=PASSWORD_TOO_SHORT');
  }

  // Check if user with this email already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    redirect('/admin/users?error=EMAIL_EXISTS');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
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
  } catch (err) {
    console.error('Failed to create team user:', err);
    redirect('/admin/users?error=DB_ERROR');
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?success=1');
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
