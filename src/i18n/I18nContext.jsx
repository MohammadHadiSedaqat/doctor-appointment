import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { languages, defaultLang, translations, getNested } from './translations';
import { getLanguageFromPath, localizePath } from './locale';

const I18nContext = createContext(null);

export function I18nProvider({ children, initialLang = undefined }) {
  const [lang, updateLang] = useState(() => {
    if (languages[initialLang]) return initialLang;
    return typeof window === 'undefined' ? defaultLang : getLanguageFromPath(window.location.pathname);
  });
  const dir = languages[lang].dir;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem('med_lang', lang); } catch { /* storage is optional */ }
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    // Preserve links shared before the locale URL migration.
    const url = new URL(window.location.href);
    const legacyLang = url.searchParams.get('lang');
    if (legacyLang) {
      url.searchParams.delete('lang');
      const targetLang = languages[legacyLang] ? legacyLang : lang;
      url.pathname = localizePath(url.pathname, targetLang);
      if (targetLang !== lang) window.location.replace(`${url.pathname}${url.search}${url.hash}`);
      else window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }, [lang, dir]);

  const setLang = useCallback((nextLang) => {
    if (!languages[nextLang] || nextLang === lang) return;
    if (typeof window === 'undefined') { updateLang(nextLang); return; }
    const url = new URL(window.location.href);
    url.pathname = localizePath(url.pathname, nextLang);
    url.searchParams.delete('lang');
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }, [lang]);

  const t = useCallback((key) => getNested(translations[lang] || {}, key) ?? getNested(translations[defaultLang], key) ?? key, [lang]);
  const tr = useCallback((obj, field) => obj?.[`${field}_${lang}`] || obj?.[`${field}_${defaultLang}`] || obj?.[`${field}_en`] || '', [lang]);
  return <I18nContext.Provider value={{ lang, setLang, dir, t, tr, languages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}
