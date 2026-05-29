import { OgCategory } from '../api/og/ogConfig'

const BASE = 'https://www.imagesnap.cloud'

export function ogUrl(title: string, category: OgCategory, description?: string): string {
  const url = new URL(`${BASE}/api/og`)
  url.searchParams.set('title', title)
  url.searchParams.set('category', category)
  if (description) url.searchParams.set('description', description)
  return url.toString()
}
