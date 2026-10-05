import { describe, it, expect, vi } from 'vitest';
import {
  createAgeGateToken,
  verifyAgeGateToken,
  sanitizeReturnTo,
} from '@/lib/age-gate';

describe('Age Gate Token & Validation Unit Tests', () => {
  it('creates and verifies a valid age_ok JWT token', async () => {
    const token = await createAgeGateToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const isValid = await verifyAgeGateToken(token);
    expect(isValid).toBe(true);
  });

  it('rejects an invalid or tampered token', async () => {
    const tampered = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.tamperedSignature';
    const isValid = await verifyAgeGateToken(tampered);
    expect(isValid).toBe(false);
  });

  it('rejects undefined, null or empty token', async () => {
    expect(await verifyAgeGateToken(undefined)).toBe(false);
    expect(await verifyAgeGateToken(null)).toBe(false);
    expect(await verifyAgeGateToken('')).toBe(false);
  });

  describe('sanitizeReturnTo', () => {
    it('allows valid relative internal paths', () => {
      expect(sanitizeReturnTo('/story/sample-story-1')).toBe('/story/sample-story-1');
      expect(sanitizeReturnTo('/category/romance')).toBe('/category/romance');
      expect(sanitizeReturnTo('/')).toBe('/');
    });

    it('blocks open redirects to external protocols or domains', () => {
      expect(sanitizeReturnTo('https://evil.com')).toBe('/');
      expect(sanitizeReturnTo('http://attacker.com')).toBe('/');
      expect(sanitizeReturnTo('//evil.com')).toBe('/');
      expect(sanitizeReturnTo('\\evil.com')).toBe('/');
      expect(sanitizeReturnTo('javascript:alert(1)')).toBe('/');
    });

    it('blocks redirecting back to gate or access denied', () => {
      expect(sanitizeReturnTo('/age-gate')).toBe('/');
      expect(sanitizeReturnTo('/access-denied')).toBe('/');
    });
  });
});
