import { db } from '@/lib/db';
import { StoryStatus, Prisma } from '@prisma/client';
import { STORIES_PER_PAGE } from '@/config/constants';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface GetStoriesOptions {
  page?: number;
  perPage?: number;
  categoryId?: string;
  categorySlug?: string;
  status?: StoryStatus;
  search?: string;
  orderBy?: Prisma.StoryOrderByWithRelationInput;
}

export async function getPaginatedStories(
  options: GetStoriesOptions = {}
): Promise<PaginatedResult<Prisma.StoryGetPayload<{ include: { category: true } }>>> {
  const page = Math.max(1, options.page || 1);
  const perPage = options.perPage || STORIES_PER_PAGE;
  const skip = (page - 1) * perPage;

  const where: Prisma.StoryWhereInput = {};

  if (options.status) {
    where.status = options.status;
  } else {
    // Default for public callers
    where.status = StoryStatus.PUBLISHED;
  }

  if (options.categoryId) {
    where.categoryId = options.categoryId;
  }

  if (options.categorySlug) {
    where.category = { slug: options.categorySlug };
  }

  if (options.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { excerpt: { contains: options.search, mode: 'insensitive' } },
    ];
  }

  const orderBy = options.orderBy || { publishedAt: 'desc' };

  const [total, items] = await db.$transaction([
    db.story.count({ where }),
    db.story.findMany({
      where,
      skip,
      take: perPage,
      orderBy,
      include: {
        category: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items,
    total,
    totalPages,
    page,
    perPage,
  };
}

export async function getStoryBySlug(slug: string) {
  return db.story.findUnique({
    where: { slug },
    include: {
      category: true,
      parts: {
        orderBy: { partNumber: 'asc' },
      },
    },
  });
}

export async function publishDueScheduledStories(): Promise<number> {
  const now = new Date();

  const dueStories = await db.story.findMany({
    where: {
      status: StoryStatus.SCHEDULED,
      scheduledAt: { lte: now },
    },
    select: { id: true },
  });

  if (dueStories.length === 0) return 0;

  const result = await db.story.updateMany({
    where: {
      id: { in: dueStories.map((s) => s.id) },
    },
    data: {
      status: StoryStatus.PUBLISHED,
      publishedAt: now,
    },
  });

  return result.count;
}
