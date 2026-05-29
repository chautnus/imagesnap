export type OgCategory =
  | 'homepage'
  | 'pricing'
  | 'blog'
  | 'features'
  | 'alternatives'
  | 'compare'
  | 'use-cases'
  | 'tools'
  | 'integrations'

export type OgParams = {
  title: string
  description?: string
  category?: OgCategory
}

type CategoryStyle = {
  accent: string
  badge: string
}

export const CATEGORY_STYLES: Record<OgCategory, CategoryStyle> = {
  homepage:     { accent: '#0078D7', badge: '' },
  pricing:      { accent: '#10B981', badge: '💳 Pricing' },
  blog:         { accent: '#8B5CF6', badge: '✍️ Blog' },
  features:     { accent: '#0078D7', badge: '⚡ Feature' },
  alternatives: { accent: '#F59E0B', badge: '🔄 Alternative' },
  compare:      { accent: '#EF4444', badge: '⚖️ Compare' },
  'use-cases':  { accent: '#06B6D4', badge: '🎯 Use Case' },
  tools:        { accent: '#6366F1', badge: '🛠️ Tool' },
  integrations: { accent: '#10B981', badge: '🔗 Integration' },
}

export const DEFAULT_STYLE: CategoryStyle = { accent: '#0078D7', badge: '' }

export function parseOgParams(searchParams: URLSearchParams): OgParams {
  const title = searchParams.get('title') ?? 'ImageSnap'
  const description = searchParams.get('description') ?? undefined
  const raw = searchParams.get('category') ?? ''
  const category = (raw in CATEGORY_STYLES ? raw : undefined) as OgCategory | undefined
  return { title, description, category }
}
