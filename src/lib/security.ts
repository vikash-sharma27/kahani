import crypto from 'crypto';

/**
 * Hash IP addresses with a salt to ensure GDPR/privacy compliance
 * No raw IP is ever stored in the database.
 */
export function hashIp(ip: string, salt: string = process.env.AUTH_SECRET || 'default-salt'): string {
  return crypto.createHmac('sha256', salt).update(ip).digest('hex');
}

/**
 * Hash User-Agent strings for lightweight telemetry without identifying the user.
 */
export function hashUserAgent(userAgent: string): string {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
}
