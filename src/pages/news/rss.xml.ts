import type { APIRoute } from 'astro'
import { NEWS } from '~/data/news'
import { SITE } from '~/data/site'

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Backtick spans become <code>; the site renders senses the same way. */
const senseHtml = (text: string) =>
  escapeXml(text).replace(/`([^`]+)`/g, '<code>$1</code>')

const entryHtml = (senses: string[]) =>
  senses.map((s, i) => `<p>${i + 1}. ${senseHtml(s)}</p>`).join('\n')

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.url)
  const entries = NEWS.map((e) => {
    const url = new URL(`/news/${e.slug}/`, base).href
    const pubDate = new Date(`${e.date}T00:00:00Z`).toUTCString()
    return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(e.summary)}</description>
      <content:encoded><![CDATA[<p>${escapeXml(e.summary)}</p>
${entryHtml(e.senses)}]]></content:encoded>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kotoshu — News</title>
    <link>${new URL('/news/', base).href}</link>
    <atom:link href="${new URL('/news/rss.xml', base).href}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml('Kotoshu releases and events, newest first.')}</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${NEWS[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>
${entries}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
