import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

describe('Rate Limiter Unit Tests', () => {
  const testKey = 'test_ip_127_0_0_1';

  beforeEach(() => {
    resetRateLimit(testKey);
  });

  it('allows requests up to maxAttempts', () => {
    for (let i = 1; i <= 5; i++) {
      const result = checkRateLimit(testKey, 5, 1000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5 - i);
    }
  });

  it('blocks the 6th request when maxAttempts is 5', () => {
    for (let i = 1; i <= 5; i++) {
      checkRateLimit(testKey, 5, 1000);
    }
    const sixth = checkRateLimit(testKey, 5, 1000);
    expect(sixth.allowed).toBe(false);
    expect(sixth.remaining).toBe(0);
  });

  it('allows access again after reset', () => {
    for (let i = 1; i <= 5; i++) {
      checkRateLimit(testKey, 5, 1000);
    }
    expect(checkRateLimit(testKey, 5, 1000).allowed).toBe(false);

    resetRateLimit(testKey);
    expect(checkRateLimit(testKey, 5, 1000).allowed).toBe(true);
  });
});
