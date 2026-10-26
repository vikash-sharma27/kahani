import crypto from 'crypto';
import { db } from '@/lib/db';

export async function createPasswordResetToken(email: string): Promise<string> {
  // Check if user exists
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Generate a dummy delay to prevent account enumeration timing attacks
    await new Promise((resolve) => setTimeout(resolve, 300));
    return '';
  }

  // Delete any existing tokens for this email
  await db.passwordResetToken.deleteMany({
    where: { email },
  });

  // Generate cryptographic token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

  await db.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt,
    },
  });

  return token;
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const resetLink = `${siteUrl}/admin/reset-password?token=${token}`;

  // In development, log the link to console so you can test without Resend API key
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n========================================');
    console.log('🔑 [PASSWORD RESET LINK FOR DEV]:');
    console.log(resetLink);
    console.log('========================================\n');
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL || 'security@storynest.internal',
        to: email,
        subject: `Admin Password Reset - ${process.env.SITE_NAME || 'Chut Ki Kahani'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Team Account Password Reset</h2>
            <p>You requested a password reset for your team account. Click the button below to choose a new password:</p>
            <p style="margin: 24px 0;">
              <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </p>
            <p style="color: #666; font-size: 13px;">This single-use link is valid for 1 hour. If you did not make this request, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to dispatch password reset email:', err);
    return false;
  }
}
