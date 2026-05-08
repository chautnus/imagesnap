import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.imagesnap.cloud'
  
  const routes = [
    '',
    '/pricing',
    '/privacy',
    '/blog',
    '/blog/why-copy-paste-research-breaks-at-scale',
    '/blog/building-competitor-database-without-scraper',
    '/blog/human-guided-capture-vs-full-automation',
    '/blog/why-i-built-imagesnap',
    '/use-cases/construction-teams',
    '/use-cases/competitor-tracking-beyond-keyword-tools',
    '/use-cases/swipe-file-tool',
    '/use-cases/ecommerce-studios',
    '/compare/imagesnap-vs-manual-spreadsheet',
    '/compare/imagesnap-vs-custom-scraper',
    '/compare/imagesnap-vs-web-clipper',
    '/compare/imagesnap-vs-scraping-api',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
