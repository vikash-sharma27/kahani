import { describe, it, expect } from 'vitest';
import { sanitizeStoryContent } from '@/lib/sanitize';
import { generateSlug } from '@/lib/slug';

describe('Story CMS Sanitizer & Slug Utilities', () => {
  it('strips all image tags, media, and malicious scripts from story content', () => {
    const dirty = `
      <p>यह एक सुरक्षित पैराग्राफ है।</p>
      <img src="https://evil.com/leak.jpg" alt="test" />
      <script>alert('xss');</script>
      <iframe src="https://malicious.com"></iframe>
      <strong>बोल्ड टेक्स्ट</strong>
    `;

    const clean = sanitizeStoryContent(dirty);
    expect(clean).not.toContain('<img');
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('<iframe');
    expect(clean).toContain('<p>यह एक सुरक्षित पैराग्राफ है।</p>');
    expect(clean).toContain('<strong>बोल्ड टेक्स्ट</strong>');
  });

  it('transliterates Hindi titles to clean URL-safe Latin slugs', () => {
    const title = 'दिल के करीब एक शाम';
    const slug = generateSlug(title);
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug).toContain('dil-ke');
    expect(slug).toContain('shaam');
  });

  it('handles mixed English and Hindi titles', () => {
    const mixed = 'रात का सफर Episode 1';
    const slug = generateSlug(mixed);
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug).toContain('episode-1');
  });

  it('provides fallback slug when input is empty or invalid', () => {
    const emptySlug = generateSlug('!!!', 'fallback123');
    expect(emptySlug).toBe('story-fallback123');
  });
});
