'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import { generateSlug } from '@/lib/slug';

export async function createCategoryAction(formData: FormData) {
  const session = await requireRole(Role.ADMIN);

  const name = (formData.get('name') as string) || '';
  const slugInput = (formData.get('slug') as string) || '';
  const description = (formData.get('description') as string) || '';
  const colour = (formData.get('colour') as string) || 'rose';
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
  const seoTitle = formData.get('seoTitle') as string | null;
  const seoDescription = formData.get('seoDescription') as string | null;

  const slug = slugInput ? generateSlug(slugInput) : generateSlug(name);

  const category = await db.category.create({
    data: {
      name,
      slug,
      description,
      colour,
      sortOrder,
      seoTitle,
      seoDescription,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'CREATE_CATEGORY',
      entity: 'CATEGORY',
      entityId: category.id,
      metadata: { name, slug },
    },
  });

  revalidatePath('/');
  revalidatePath('/categories');
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await requireRole(Role.ADMIN);

  // SAFE DELETE: Block deleting a category that still has stories
  const storyCount = await db.story.count({
    where: { categoryId },
  });

  if (storyCount > 0) {
    throw new Error(
      `सुरक्षित विलोपन नियम: इस श्रेणी में अभी ${storyCount} कहानियाँ हैं। पहले उन्हें दूसरी श्रेणी में स्थानांतरित करें।`
    );
  }

  await db.category.delete({
    where: { id: categoryId },
  });

  await db.auditLog.create({
    data: {
      actorId: session.userId,
      action: 'DELETE_CATEGORY',
      entity: 'CATEGORY',
      entityId: categoryId,
    },
  });

  revalidatePath('/');
  revalidatePath('/categories');
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}
