import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.imagesnap.cloud'
  
  const routes = [
    '',
    '/pricing',
    '/alternatives/companycam-alternative',
    '/alternatives/pics-io-alternative',
    '/alternatives/google-photos-vs-imagesnap',
    '/use-cases/construction-teams',
    '/use-cases/competitor-tracking-beyond-keyword-tools',
    '/use-cases/swipe-file-tool',
    '/use-cases/ecommerce-studios',
    '/use-cases/real-estate-photographers',
    '/use-cases/field-inspections',
    '/compare/imagesnap-vs-manual-spreadsheet',
    '/compare/imagesnap-vs-custom-scraper',
    '/compare/imagesnap-vs-web-clipper',
    '/compare/imagesnap-vs-scraping-api',
    '/features/web-image-import',
    '/features/auto-folder-organization',
    '/features/team-collaboration',
    '/features/metadata-auto-fill',
    '/integrations/google-drive',
    '/tools/exif-viewer',
    '/tools/bulk-photo-renamer',
    '/tools/drive-folder-generator',
    '/blog',
    '/blog/why-copy-paste-research-breaks-at-scale',
    '/blog/building-competitor-database-without-scraper',
    '/blog/human-guided-capture-vs-full-automation',
    '/blog/why-i-built-imagesnap',
    '/privacy',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
