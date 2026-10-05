import sanitizeHtml from 'sanitize-html';

export function sanitizeStoryContent(dirtyHtml: string): string {
  return sanitizeHtml(dirtyHtml, {
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
