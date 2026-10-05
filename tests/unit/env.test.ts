import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Environment Variables Schema', () => {
  const envSchema = z.object({
    DATABASE_URL: z.string().url().refine((url) => url.includes('sslmode=require')),
    DIRECT_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    AGE_GATE_SECRET: z.string().min(32),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    SITE_NAME: z.string().min(1),
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(12),
    RESEND_API_KEY: z.string().min(1),
    NOTIFY_EMAIL: z.string().email(),
    AGE_GATE_MODE: z.enum(['overlay', 'redirect']).default('overlay'),
  });

  it('fails when required variables are missing', () => {
    const emptyEnv = {};
    const result = envSchema.safeParse(emptyEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorKeys = result.error.errors.map((e) => e.path[0]);
      expect(errorKeys).toContain('DATABASE_URL');
      expect(errorKeys).toContain('DIRECT_URL');
      expect(errorKeys).toContain('AUTH_SECRET');
      expect(errorKeys).toContain('SITE_NAME');
    }
  });

  it('succeeds with valid environment variables', () => {
    const validEnv = {
      DATABASE_URL: 'postgresql://user:pass@host/db?sslmode=require',
      DIRECT_URL: 'postgresql://user:pass@host/db?sslmode=require',
      AUTH_SECRET: 'a'.repeat(32),
      AGE_GATE_SECRET: 'b'.repeat(32),
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      SITE_NAME: 'KahaniNest',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'password123456',
      RESEND_API_KEY: 'resend_key',
      NOTIFY_EMAIL: 'notify@example.com',
      AGE_GATE_MODE: 'overlay',
    };
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });
});
