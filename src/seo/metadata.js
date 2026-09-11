import { site } from '@/config/site';
import { getRouteMeta, getSiteUrl, seoLanguages } from '@/seo/routes';

export function buildMetadata(pathname, lang = 'fa', origin) {
  pathname = pathname.replace(/\/+$/, '') || '/';
  const meta = getRouteMeta(pathname, lang);
  const canonical = meta.indexable && !meta.unknown ? getSiteUrl(pathname, lang) : '';
  const onPublicHost = !origin || !canonical || new URL(canonical).origin === origin;
  const indexable = Boolean(site.indexable && canonical && meta.indexable && !meta.unknown && onPublicHost);
  const clinic = {
    '@type': 'MedicalClinic',
    '@id': getSiteUrl('/') ? `${getSiteUrl('/')}#practice` : undefined,
    name: site.name[lang],
    url: getSiteUrl('/') || undefined,
    medicalSpecialty: 'https://schema.org/Musculoskeletal',
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.address?.[lang] ? { address: { '@type': 'PostalAddress', streetAddress: site.address[lang], ...(site.city?.[lang] ? { addressLocality: site.city[lang] } : {}) } } : {}),
  };
  const physician = {
    '@type': 'Physician',
    '@id': getSiteUrl('/') ? `${getSiteUrl('/')}#physician` : undefined,
    name: site.name[lang],
    description: site.specialty[lang],
    medicalSpecialty: 'https://schema.org/Musculoskeletal',
    url: getSiteUrl('/about', lang) || undefined,
    ...(site.medicalLicense ? { identifier: site.medicalLicense } : {}),
    ...(site.portraitUrl ? { image: site.portraitUrl } : {}),
    ...(site.socialLinks?.length ? { sameAs: site.socialLinks.map((link) => typeof link === 'string' ? link : link.url).filter(Boolean) } : {}),
  };
  /** @type {Array<Record<string, any>>} */
  const graph = meta.unknown || !meta.indexable ? [] : [physician];
  if (pathname === '/' || pathname === '/clinic') graph.push(clinic);
  if (meta.service) {
    graph.push({
      '@type': 'Service',
      name: meta.title.split(' |')[0],
      description: meta.description,
      provider: physician,
      url: canonical || undefined,
      // The provisional editorial price is deliberately excluded from structured offers.
    });
  }
  if (pathname !== '/' && !meta.unknown && canonical) {
    const crumbs = [
      { '@type': 'ListItem', position: 1, name: { fa: 'خانه', en: 'Home', ar: 'الرئيسية' }[lang], item: getSiteUrl('/', lang) },
    ];
    if (meta.service) crumbs.push({ '@type': 'ListItem', position: 2, name: { fa: 'خدمات', en: 'Services', ar: 'الخدمات' }[lang], item: getSiteUrl('/services', lang) });
    crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: meta.title.split(' |')[0], item: canonical });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
  }
  return {
    ...meta,
    indexable,
    canonical,
    robots: indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow',
    locale: { fa: 'fa_IR', en: 'en_US', ar: 'ar_SA' }[lang],
    alternates: canonical && meta.indexable && !meta.unknown ? [...seoLanguages.map((locale) => ({ lang: locale, url: getSiteUrl(pathname, locale) })), { lang: 'x-default', url: getSiteUrl(pathname, 'fa') }] : [],
    structuredData: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null,
    image: site.portraitUrl || '',
  };
}

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export function metadataHtml(meta) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    `<meta name="googlebot" content="${meta.robots}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:locale" content="${meta.locale}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  ];
  if (meta.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`, `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`);
  if (meta.image) tags.push(`<meta property="og:image" content="${escapeHtml(meta.image)}" />`, `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`);
  meta.alternates.forEach((alternate) => tags.push(`<link rel="alternate" hreflang="${alternate.lang}" href="${escapeHtml(alternate.url)}" />`));
  if (meta.structuredData) tags.push(`<script id="seo-jsonld" type="application/ld+json">${JSON.stringify(meta.structuredData).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}
