import { MetadataRoute } from 'next'

type Route = {
  path: string
  priority: number
  lastMod: string
  changeFreq?: MetadataRoute.Sitemap[number]['changeFrequency']
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.imagesnap.cloud'

  const routes: Route[] = [
    { path: '', priority: 1.0, lastMod: '2026-05-17', changeFreq: 'weekly' },
    { path: '/pricing', priority: 0.9, lastMod: '2026-05-17' },
    { path: '/blog', priority: 0.8, lastMod: '2026-05-17', changeFreq: 'weekly' },

    { path: '/blog/why-copy-paste-research-breaks-at-scale', priority: 0.7, lastMod: '2026-05-05' },
    { path: '/blog/building-competitor-database-without-scraper', priority: 0.7, lastMod: '2026-05-03' },
    { path: '/blog/human-guided-capture-vs-full-automation', priority: 0.7, lastMod: '2026-05-01' },
    { path: '/blog/why-i-built-imagesnap', priority: 0.7, lastMod: '2026-04-28' },

    { path: '/alternatives/companycam-alternative', priority: 0.8, lastMod: '2026-05-17' },
    { path: '/alternatives/pics-io-alternative', priority: 0.8, lastMod: '2026-05-17' },
    { path: '/alternatives/google-photos-vs-imagesnap', priority: 0.8, lastMod: '2026-05-17' },

    { path: '/compare/imagesnap-vs-manual-spreadsheet', priority: 0.8, lastMod: '2026-05-06' },
    { path: '/compare/imagesnap-vs-custom-scraper', priority: 0.8, lastMod: '2026-05-06' },
    { path: '/compare/imagesnap-vs-web-clipper', priority: 0.8, lastMod: '2026-05-06' },
    { path: '/compare/imagesnap-vs-scraping-api', priority: 0.8, lastMod: '2026-05-06' },

    { path: '/use-cases/competitor-tracking-beyond-keyword-tools', priority: 0.7, lastMod: '2026-05-06' },
    { path: '/use-cases/swipe-file-tool', priority: 0.7, lastMod: '2026-05-06' },
    { path: '/use-cases/construction-teams', priority: 0.7, lastMod: '2026-05-06' },
    { path: '/use-cases/ecommerce-studios', priority: 0.7, lastMod: '2026-05-17' },
    { path: '/use-cases/real-estate-photographers', priority: 0.7, lastMod: '2026-05-17' },
    { path: '/use-cases/field-inspections', priority: 0.7, lastMod: '2026-05-17' },

    { path: '/privacy', priority: 0.3, lastMod: '2026-05-06', changeFreq: 'yearly' },
  ]

  return routes.map(({ path, priority, lastMod, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(lastMod),
    changeFrequency: changeFreq ?? 'monthly',
    priority,
  }))
}
