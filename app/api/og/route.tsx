import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { OgTemplate } from './OgTemplate'
import { parseOgParams } from './ogConfig'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const params = parseOgParams(req.nextUrl.searchParams)

  return new ImageResponse(
    OgTemplate(params),
    {
      width: 1200,
      height: 630,
    }
  )
}
