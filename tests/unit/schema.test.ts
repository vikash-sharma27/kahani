import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Prisma Schema Verification', () => {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

  it('contains NO image, coverImage, or media fields in any model', () => {
    // CONTENT FORMAT RULE: Stories are TEXT-ONLY. No cover image, no image upload, no inline images.
    const imageKeywords = ['coverImage', 'imageUrl', 'imagePath', 'photoUrl', 'avatarUrl', 'cover_image'];
    for (const kw of imageKeywords) {
      expect(schemaContent).not.toContain(kw);
    }
  });

  it('contains all required models', () => {
    const requiredModels = [
      'model User',
      'model Story',
      'model StoryPart',
      'model StoryRevision',
      'model Category',
      'model StorySubmission',
      'model Comment',
      'model Bookmark',
      'model Like',
      'model ReadingHistory',
      'model Report',
      'model BlockedDevice',
      'model Advertisement',
      'model AgeConsentLog',
      'model AuditLog',
      'model SiteSetting',
      'model SeoSetting',
    ];

    for (const model of requiredModels) {
      expect(schemaContent).toContain(model);
    }
  });

  it('enforces required indexes on Story and Comment', () => {
    expect(schemaContent).toContain('@@index([status, publishedAt(sort: Desc)])');
    expect(schemaContent).toContain('@@index([categoryId, status, publishedAt])');
    expect(schemaContent).toContain('@@index([slug])');
    expect(schemaContent).toContain('@@index([storyId, status])');
    expect(schemaContent).toContain('@@index([deviceId])');
  });

  it('contains pg_trgm and unaccent in initial migration', () => {
    const migrationPath = path.join(process.cwd(), 'prisma', 'migrations', '0_init', 'migration.sql');
    const migrationContent = fs.readFileSync(migrationPath, 'utf-8');
    expect(migrationContent).toContain('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    expect(migrationContent).toContain('CREATE EXTENSION IF NOT EXISTS unaccent;');
  });
});
