# SEO and publication

The build prerenders the actual public React pages into HTML. It includes the home page, about, qualifications, clinic, services, each service detail, pricing, contact and privacy. Persian uses `/`, English `/en/`, and Arabic `/ar/`. All three versions have matching visible text, page titles, descriptions, language tags and internal links before JavaScript loads.

`src/seo/routes.js` is the registry for public URLs and localized metadata. `src/seo/metadata.js` supplies both the initial HTML and client navigation metadata: canonical URLs, Open Graph, Twitter cards, hreflang, physician/service structured data and breadcrumbs. Discovery files use the same registry. The provisional service prices are excluded from structured offers; reviews, addresses and credentials are never fabricated.

## Preview and production

Search indexing is disabled by default. No app has been published or remote setting changed by this implementation. Development hosts remain noindex even if built with production settings. Account, booking and unknown routes are noindex and are excluded from the sitemap.

After the owner approves publishing and a public HTTPS domain is available, set these build environment variables in the hosting environment:

```dotenv
VITE_PUBLIC_SITE_URL=https://your-verified-domain.example
VITE_SITE_INDEXABLE=true
```

Use the real canonical domain. Do not use localhost, `.local`, a `.test` host, an editor URL or a private preview URL. The public site must be accessible without login, but account/medical records remain behind their existing access controls. Run a new build after changing either variable.

```bash
npm run build
node --test tests/seo.test.js
```

The output contains 51 public HTML pages across three languages, `robots.txt`, the manifest and favicon, and `sitemap.xml` when indexing is enabled. `dist/seo-build.json` records the generated routes so the SEO test can check the actual output.

The host must serve each generated directory's `index.html` before an SPA fallback. Direct requests to `/services/orthopedic-consultation`, `/en/services/orthopedic-consultation` and `/ar/about` must return their own title and visible body, not the home page. Unknown URLs must return a real HTTP 404 on the deployed host. Client navigation alone cannot set an HTTP response code; verify this after publishing. If Base44's publishing layer replaces local HTML metadata or routing, verify the deployed source and configure its SEO settings to match.

## Information still required from the practice

Keep `src/config/site.js` as the single source for verified contact details, address/city, official portrait, registration/license number, social links and operating hours. Unconfirmed details are intentionally omitted. Add complete accurate practice details before enabling indexing, and use the same name/address/phone in the website and business listings. Do not publish the temporary 1,000 toman prices as confirmed fees.

Verify the final domain in Google Search Console and submit `/sitemap.xml`. Check indexing and mobile Core Web Vitals from the public production site. Configure a Google Business Profile with the actual location and contact information when applicable. The public doctor profile should link to independently verifiable credentials when supplied; health content should be reviewed by the treating physician.

Technical SEO can improve crawlability and presentation. It cannot guarantee first place for “doctor” or “orthopedist”; search ranking also depends on location, competition, reputation, verified information and useful medical content. A Lighthouse score alone does not guarantee indexing or ranking.
