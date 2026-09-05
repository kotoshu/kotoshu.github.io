import type { APIRoute } from 'astro'
import { NEWS } from '~/data/news'
import { SITE } from '~/data/site'

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const senseHtml = (text: string) =>
  escapeXml(text).replace(/`([^`]+)`/g, '<code>$1</code>')

const entryHtml = (senses: string[]) =>
  senses.map((s, i) => `<p>${i + 1}. ${senseHtml(s)}</p>`).join('\n')

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.url)
  const feedUpdated = new Date(`${NEWS[0].date}T00:00:00Z`).toISOString()

  const entries = NEWS.map((e) => {
    const url = new URL(`/news/${e.slug}/`, base).href
    return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(e.title)}</title>
    <link href="${url}"/>
    <published>${new Date(`${e.date}T00:00:00Z`).toISOString()}</published>
    <updated>${new Date(`${e.date}T00:00:00Z`).toISOString()}</updated>
    <summary>${escapeXml(e.summary)}</summary>
    <content type="html">${escapeXml(`<p>${escapeXml(e.summary)}</p>\n${entryHtml(e.senses)}`)}</content>
  </entry>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${new URL('/news/', base).href}</id>
  <title>Kotoshu — News</title>
  <link href="${new URL('/news/', base).href}"/>
  <link href="${new URL('/news/atom.xml', base).href}" rel="self"/>
  <updated>${feedUpdated}</updated>
  <author><name>${escapeXml(SITE.author)}</name></author>
${entries}
</feed>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } })
}
