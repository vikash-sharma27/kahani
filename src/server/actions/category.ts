'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import { getUniqueCategorySlug } from '@/lib/slug';

export async function createCategoryAction(formData: FormData) {
  const session = await requireRole(Role.ADMIN);

  const name = ((formData.get('name') as string) || '').trim();
  const slugInput = ((formData.get('slug') as string) || '').trim();
  const description = ((formData.get('description') as string) || '').trim();
  const colour = (formData.get('colour') as string) || 'rose';
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
  const seoTitle = (formData.get('seoTitle') as string | null)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string | null)?.trim() || null;

  if (!name) {
    redirect('/admin/categories?error=NAME_REQUIRED');
  }

  const slug = await getUniqueCategorySlug(slugInput || name);

  try {
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
  } catch (err) {
    console.error('Failed to create category:', err);
    redirect('/admin/categories?error=CREATE_FAILED');
  }

  revalidatePath('/');
  revalidatePath('/categories');
  revalidatePath('/admin/categories');
  redirect('/admin/categories?success=CREATED');
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await requireRole(Role.ADMIN);

  // SAFE DELETE: Block deleting a category that still has stories
  const storyCount = await db.story.count({
    where: { categoryId },
  });

  if (storyCount > 0) {
    redirect(`/admin/categories?error=HAS_STORIES&count=${storyCount}`);
  }

  try {
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
  } catch (err) {
    console.error('Failed to delete category:', err);
    redirect('/admin/categories?error=DELETE_FAILED');
  }

  revalidatePath('/');
  revalidatePath('/categories');
  revalidatePath('/admin/categories');
  redirect('/admin/categories?success=DELETED');
}
