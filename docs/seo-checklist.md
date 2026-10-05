# SEO and Indexing Checklist

This document details the technical SEO and crawling configurations implemented in StoryNest.

## 1. Technical Implementation

- **Next.js Metadata API**: Every page defines unique, targeted `<title>`, `<meta description>`, and `<link rel="canonical">`.
- **RTA & Adult Tags**:
  - `<meta name="rating" content="adult" />`
  - `<meta name="RTA-5042-1996-1400-1577-RTA" content="RTA-5042-1996-1400-1577-RTA" />`
  - HTTP Header: `Rating: adult` configured in `next.config.mjs`.
- **No Cloaking**: Search engine crawlers and human visitors receive identical HTML. The age gate is implemented as an overlay above the server-rendered content, keeping the underlying text crawlable without tricking crawlers.
- **Dynamic XML Sitemap**: Generated automatically at `/sitemap.xml`, containing all published stories and categories.
- **Robots Directives**: `/robots.txt` explicitly disallows sensitive administrative paths (`/admin`, `/api`, `/search`).

## 2. Google Search Console Setup Steps

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property as URL Prefix: `https://your-domain.com`.
3. Verify domain ownership via DNS TXT record or HTML meta tag.
4. Under **Sitemaps**, submit: `https://your-domain.com/sitemap.xml`.
5. Check URL Inspection for the root URL and ensure pages are indexed without blocking resources.
