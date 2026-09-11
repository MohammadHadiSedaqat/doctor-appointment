import { writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const xml = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function generateDiscoveryFiles(outDir, { paths, languages, buildMetadata, getSiteUrl }) {
  const home = buildMetadata('/', 'fa');
  const siteUrl = getSiteUrl('/');
  const robots = home.indexable && siteUrl
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteUrl)}\n`
    : '# This preview is not ready for public indexing.\nUser-agent: *\nDisallow: /\n';
  await writeFile(resolve(outDir, 'robots.txt'), robots);
  const entries = [];
  if (home.indexable) {
    for (const path of paths) {
      for (const lang of languages) {
        const meta = buildMetadata(path, lang);
        if (!meta.indexable) continue;
        const alternates = meta.alternates.map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${xml(alternate.url)}" />`).join('\n');
        entries.push(`  <url>\n    <loc>${xml(meta.canonical)}</loc>\n${alternates}\n  </url>`);
      }
    }
  }
  if (entries.length) {
    await writeFile(resolve(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
  } else await rm(resolve(outDir, 'sitemap.xml'), { force: true });
  return entries.length;
}
