import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer as createHttpServer } from 'node:http';
import { generateDiscoveryFiles } from './generate-seo.mjs';

process.env.NODE_ENV = 'production';
const root = process.cwd();
const distDir = resolve(root, 'dist');
const vite = await createServer({
  root,
  configFile: false,
  mode: 'production',
  plugins: [react()],
  resolve: { alias: { '@': resolve(root, 'src') } },
  appType: 'custom',
  server: { middlewareMode: true, hmr: { server: createHttpServer() } },
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const [{ renderPublicRoute, prerenderRoutes }, seo, metadata] = await Promise.all([
    vite.ssrLoadModule('/src/entry-prerender.jsx'),
    vite.ssrLoadModule('/src/seo/routes.js'),
    vite.ssrLoadModule('/src/seo/metadata.js'),
  ]);
  const template = (await readFile(resolve(distDir, 'index.html'), 'utf8'))
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<meta\s+(?:name="(?:description|robots|googlebot|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
    .replace(/<link\s+rel="(?:canonical|alternate)"[^>]*>/g, '')
    .replace(/<script\s+id="seo-jsonld"[\s\S]*?<\/script>/g, '');
  const outputs = [];
  for (const pathname of prerenderRoutes) {
    for (const lang of seo.seoLanguages) {
      const markup = renderPublicRoute(pathname, lang);
      const meta = metadata.buildMetadata(pathname, lang);
      const document = template
        .replace(/<html[^>]*>/, `<html lang="${lang}" dir="${lang === 'en' ? 'ltr' : 'rtl'}">`)
        .replace('</head>', `    ${metadata.metadataHtml(meta)}\n  </head>`)
        .replace(/<div id="root"(?:\s[^>]*)?>[\s\S]*<\/div>/, `<div id="root" data-prerendered="true">${markup}</div>`);
      const localizedPath = seo.getLocalizedPath(pathname, lang);
      const output = localizedPath === '/' ? resolve(distDir, 'index.html') : resolve(distDir, localizedPath.slice(1), 'index.html');
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, document, 'utf8');
      outputs.push({ path: pathname, locale: lang, file: output.slice(distDir.length + 1), title: meta.title, canonical: meta.canonical, indexable: meta.indexable });
    }
  }
  for (const lang of seo.seoLanguages) {
    const markup = renderPublicRoute('/404', lang);
    const meta = metadata.buildMetadata('/404', lang);
    const document = template
      .replace(/<html[^>]*>/, `<html lang="${lang}" dir="${lang === 'en' ? 'ltr' : 'rtl'}">`)
      .replace('</head>', `    ${metadata.metadataHtml(meta)}\n  </head>`)
      .replace(/<div id="root"(?:\s[^>]*)?>[\s\S]*<\/div>/, `<div id="root" data-prerendered="true">${markup}</div>`);
    await writeFile(resolve(distDir, lang === 'fa' ? '404.html' : `${lang}/404.html`), document);
  }
  const sitemapUrls = await generateDiscoveryFiles(distDir, { paths: prerenderRoutes, languages: seo.seoLanguages, buildMetadata: metadata.buildMetadata, getSiteUrl: seo.getSiteUrl });
  await writeFile(resolve(distDir, 'seo-build.json'), JSON.stringify({ outputs, sitemapUrls }, null, 2));
  console.log(`Prerendered ${outputs.length} public pages; ${sitemapUrls ? `${sitemapUrls} sitemap URLs` : 'search indexing disabled'}.`);
} finally {
  await vite.close();
}
