export const siteConfig = {
  name: process.env.SITE_NAME || 'Chut Ki Kahani',
  description: '18+ adult fiction reading platform for Hindi original stories.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  links: {
    disclaimer: '/disclaimer',
    terms: '/terms',
    privacy: '/privacy',
    contentPolicy: '/content-policy',
    contact: '/contact',
    report: '/report',
    submitStory: '/submit-story',
  },
  disclaimerShort: '18+ Adults Only | Fictional content | Disclaimer',
};
