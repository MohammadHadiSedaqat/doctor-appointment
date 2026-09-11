import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const build = JSON.parse(await readFile(new URL('seo-build.json', dist), 'utf8'));
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

test('every public route has one visible heading, unique locale metadata and a complete HTML body', async () => {
  assert.equal(build.outputs.length, 51);
  const titles = new Set();
  for (const output of build.outputs) {
    const html = await readFile(new URL(output.file, dist), 'utf8');
    assert.match(html, new RegExp(`<html lang="${output.locale}"`), output.file);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${output.file}: one h1`);
    assert.match(html, /<main\b/, output.file);
    assert.match(html, /<footer\b/, output.file);
    assert.match(html, /data-prerendered="true"/, output.file);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), output.title, output.file);
    assert.equal((html.match(/name="description"/g) || []).length, 1, output.file);
    assert.equal((html.match(/name="robots"/g) || []).length, 1, output.file);
    assert.match(html, /property="og:title"/, output.file);
    assert.match(html, /name="twitter:card"/, output.file);
    assert.match(html, /application\/ld\+json/, output.file);
    assert.equal(titles.has(`${output.locale}:${output.title}`), false, `unique title: ${output.file}`);
    titles.add(`${output.locale}:${output.title}`);
    if (output.indexable) {
      assert.match(html, /content="index,follow,max-image-preview:large"/, output.file);
      assert.ok(html.includes(`href="${output.canonical}"`), output.file);
    } else assert.match(html, /content="noindex,follow"/, output.file);
  }
});

test('service pages contain their real localized clinical preparation content before JavaScript runs', async () => {
  for (const [path, expected] of [
    ['services/orthopedic-consultation/index.html', 'شرح حال و معاینه بالینی'],
    ['en/services/orthopedic-consultation/index.html', 'physical examination'],
    ['ar/services/orthopedic-consultation/index.html', 'الفحص السريري'],
  ]) {
    const html = await readFile(new URL(path, dist), 'utf8');
    assert.ok(html.includes(expected), path);
  }
});

test('locale routes and discovery files use one registry and exclude account paths', async () => {
  const robots = await readFile(new URL('robots.txt', dist), 'utf8');
  assert.match(robots, /User-agent:\s*\*/);
  if (build.sitemapUrls) {
    const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8');
    assert.equal((sitemap.match(/<url>/g) || []).length, build.sitemapUrls);
    assert.equal(build.sitemapUrls, build.outputs.filter((output) => output.indexable).length);
    assert.match(sitemap, /hreflang="x-default"/);
    assert.match(sitemap, /\/en\/services\/orthopedic-consultation/);
    assert.doesNotMatch(sitemap, /\/dashboard|\/login|\/register|\/appointment|\?lang=/);
    assert.match(robots, /Sitemap:/);
  } else assert.match(robots, /Disallow:\s*\//);
  const manifest = JSON.parse(await readFile(new URL('manifest.json', dist), 'utf8'));
  assert.equal(manifest.lang, 'fa');
});

test('static error documents stay noindex and do not inherit a home canonical', async () => {
  for (const file of ['404.html', 'en/404.html', 'ar/404.html']) {
    const html = await readFile(new URL(file, dist), 'utf8');
    assert.match(html, /content="noindex,follow"/, file);
    assert.doesNotMatch(html, /rel="canonical"/, file);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    assert.match(html, /404/, file);
  }
});
