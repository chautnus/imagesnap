import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.imagesnap.cloud'
  const now = new Date()

  const routes: { path: string; priority: number; changeFreq?: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    // Core
    { path: '', priority: 1.0, changeFreq: 'weekly' },
    { path: '/pricing', priority: 0.9 },
    { path: '/blog', priority: 0.8, changeFreq: 'weekly' },

    // Blog posts
    { path: '/blog/why-copy-paste-research-breaks-at-scale', priority: 0.7 },
    { path: '/blog/building-competitor-database-without-scraper', priority: 0.7 },
    { path: '/blog/human-guided-capture-vs-full-automation', priority: 0.7 },
    { path: '/blog/why-i-built-imagesnap', priority: 0.7 },

    // Alternatives (BOFU)
    { path: '/alternatives/companycam-alternative', priority: 0.8 },
    { path: '/alternatives/pics-io-alternative', priority: 0.8 },
    { path: '/alternatives/google-photos-vs-imagesnap', priority: 0.8 },

    // Comparisons (BOFU)
    { path: '/compare/imagesnap-vs-manual-spreadsheet', priority: 0.8 },
    { path: '/compare/imagesnap-vs-custom-scraper', priority: 0.8 },
    { path: '/compare/imagesnap-vs-web-clipper', priority: 0.8 },
    { path: '/compare/imagesnap-vs-scraping-api', priority: 0.8 },

    // Use Cases (MOFU)
    { path: '/use-cases/competitor-tracking-beyond-keyword-tools', priority: 0.7 },
    { path: '/use-cases/swipe-file-tool', priority: 0.7 },
    { path: '/use-cases/construction-teams', priority: 0.7 },
    { path: '/use-cases/ecommerce-studios', priority: 0.7 },

    // Legal
    { path: '/privacy', priority: 0.3 },
  ]

  return routes.map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: changeFreq ?? 'monthly',
    priority,
  }))
}
