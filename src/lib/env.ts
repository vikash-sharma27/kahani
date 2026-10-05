import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required (Neon/Supabase postgres connection string)' })
    .url('DATABASE_URL must be a valid URL')
    .refine((url) => url.includes('sslmode=require') || process.env.NODE_ENV !== 'production', {
      message: 'DATABASE_URL should have sslmode=require for secure cloud postgres',
    }),
  DIRECT_URL: z
    .string({ required_error: 'DIRECT_URL is required for direct prisma migrations/pooling bypass' })
    .url('DIRECT_URL must be a valid URL'),
  AUTH_SECRET: z
    .string({ required_error: 'AUTH_SECRET is required for Auth.js sessions' })
    .min(32, 'AUTH_SECRET should be at least 32 characters long'),
  AGE_GATE_SECRET: z
    .string({ required_error: 'AGE_GATE_SECRET is required for signed age gate tokens' })
    .min(32, 'AGE_GATE_SECRET should be at least 32 characters long'),
  NEXT_PUBLIC_SITE_URL: z
    .string({ required_error: 'NEXT_PUBLIC_SITE_URL is required' })
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL'),
  SITE_NAME: z
    .string({ required_error: 'SITE_NAME is required' })
    .min(1, 'SITE_NAME cannot be empty'),
  ADMIN_EMAIL: z
    .string({ required_error: 'ADMIN_EMAIL is required' })
    .email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD: z
    .string({ required_error: 'ADMIN_PASSWORD is required' })
    .min(12, 'ADMIN_PASSWORD must be at least 12 characters'),
  RESEND_API_KEY: z
    .string({ required_error: 'RESEND_API_KEY is required' })
    .min(1, 'RESEND_API_KEY cannot be empty'),
  NOTIFY_EMAIL: z
    .string({ required_error: 'NOTIFY_EMAIL is required' })
    .email('NOTIFY_EMAIL must be a valid email'),
  AGE_GATE_MODE: z.enum(['overlay', 'redirect']).default('overlay'),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => `  - [${err.path.join('.')}] ${err.message}`)
      .join('\n');

    const errorMessage = `
================================================================================
❌ CRITICAL ENVIRONMENT CONFIGURATION ERROR
================================================================================
The following environment variables are missing or invalid in your .env file:

${formattedErrors}

Please check your .env file against .env.example and provide the necessary values.
================================================================================
`;
    console.error(errorMessage);
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

export const env = validateEnv();
