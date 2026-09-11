import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';
import { buildMetadata, metadataHtml } from '@/seo/metadata';

const ownedTags = 'title,meta[name="description"],meta[name="robots"],meta[name="googlebot"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],link[rel="alternate"][hreflang],script#seo-jsonld';

export default function SeoHead() {
  const { lang } = useI18n();
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = buildMetadata(pathname, lang, window.location.origin);
    document.head.querySelectorAll(ownedTags).forEach((node) => node.remove());
    const template = document.createElement('template');
    template.innerHTML = metadataHtml(metadata);
    document.head.appendChild(template.content);
  }, [lang, pathname]);
  return null;
}
