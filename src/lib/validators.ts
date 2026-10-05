import { z } from 'zod';
import { STORIES_PER_PAGE } from '@/config/constants';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(STORIES_PER_PAGE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
