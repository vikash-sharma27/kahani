import sanitizeHtml from 'sanitize-html';

/**
 * Converts plain-text newlines into proper HTML paragraphs <p>...</p>
 * so spaces and paragraphs entered by the admin in textarea are preserved in reading mode.
 */
export function formatPlainTextToHtml(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();

  // If already formatted with <p> tags, preserve it
  if (/<p[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  // Split by double newline into distinct paragraphs
  const paragraphs = trimmed
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '';

  return paragraphs
    .map((p) => `<p>${p.replace(/\r?\n/g, '<br />')}</p>`)
    .join('');
}

export function sanitizeStoryContent(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  const formattedHtml = formatPlainTextToHtml(dirtyHtml);

  return sanitizeHtml(formattedHtml, {
    allowedTags: [
      'p',
      'h2',
      'h3',
      'h4',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'blockquote',
      'ul',
      'ol',
      'li',
      'hr',
      'br',
      'a',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      }),
    },
    // Strictly forbid any media/images/scripts/styles
    disallowedTagsMode: 'discard',
  });
}
