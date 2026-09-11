export const localeCodes = ['fa', 'en', 'ar'];
export const getLanguageFromPath = (pathname = '/') => /^\/(en|ar)(\/|$)/.exec(pathname)?.[1] || 'fa';
export const stripLanguagePrefix = (pathname = '/') => pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
export const getLocaleBasename = (lang) => lang === 'en' || lang === 'ar' ? `/${lang}` : '/';
export const localizePath = (pathname, lang) => {
  const path = stripLanguagePrefix(pathname);
  return lang === 'en' || lang === 'ar' ? `/${lang}${path === '/' ? '/' : path}` : path;
};
