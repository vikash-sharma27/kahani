const DEVANAGARI_MAP: Record<string, string> = {
  'अ': 'a',
  'आ': 'aa',
  'इ': 'i',
  'ई': 'ee',
  'उ': 'u',
  'ऊ': 'oo',
  'ऋ': 'ri',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
  'क': 'k',
  'ख': 'kh',
  'ग': 'g',
  'घ': 'gh',
  'ङ': 'ng',
  'च': 'ch',
  'छ': 'chh',
  'ज': 'j',
  'झ': 'jh',
  'ञ': 'ny',
  'ट': 't',
  'ठ': 'th',
  'ड': 'd',
  'ढ': 'dh',
  'ण': 'n',
  'त': 't',
  'थ': 'th',
  'द': 'd',
  'ध': 'dh',
  'न': 'n',
  'प': 'p',
  'फ': 'ph',
  'ब': 'b',
  'भ': 'bh',
  'म': 'm',
  'य': 'y',
  'र': 'r',
  'ल': 'l',
  'व': 'v',
  'श': 'sh',
  'ष': 'sh',
  'स': 's',
  'ह': 'h',
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ं': 'n',
  'ँ': 'n',
  'ः': 'h',
  '्': '',
};

export function transliterateDevanagari(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (DEVANAGARI_MAP[char]) {
      result += DEVANAGARI_MAP[char];
    } else {
      result += char;
    }
  }
  return result;
}

export function generateSlug(title: string, fallbackId?: string): string {
  const transliterated = transliterateDevanagari(title);
  const slug = transliterated
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (slug && slug.length > 2) {
    return slug;
  }

  // Fallback to id-based slug
  return fallbackId ? `story-${fallbackId.toLowerCase()}` : `story-${Date.now()}`;
}

/**
 * Ensures category slug is always 100% unique in DB, auto-appending -2, -3, etc.
 */
export async function getUniqueCategorySlug(baseText: string): Promise<string> {
  const { db } = await import('@/lib/db');
  const base = generateSlug(baseText);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) {
      return slug;
    }
    counter++;
    slug = `${base}-${counter}`;
  }
}

/**
 * Ensures story slug is always 100% unique in DB, auto-appending -2, -3, etc.
 */
export async function getUniqueStorySlug(baseText: string, currentStoryId?: string): Promise<string> {
  const { db } = await import('@/lib/db');
  const base = generateSlug(baseText);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await db.story.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || (currentStoryId && existing.id === currentStoryId)) {
      return slug;
    }
    counter++;
    slug = `${base}-${counter}`;
  }
}
