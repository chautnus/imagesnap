import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/auth', '/staff'],
    },
    sitemap: 'https://www.imagesnap.cloud/sitemap.xml',
  }
}
