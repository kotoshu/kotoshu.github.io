import type { APIRoute } from 'astro'
import { buildSearchIndex } from '~/data/search'

export const GET: APIRoute = async () => {
  const entries = buildSearchIndex()
  return new Response(JSON.stringify({ entries }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
