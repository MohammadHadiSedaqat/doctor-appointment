import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';

export default function PageNotFound() {
  const { lang, t } = useI18n();
  const copy = {
    fa: ['صفحه پیدا نشد', 'این نشانی وجود ندارد یا تغییر کرده است. از صفحه خانه یا فهرست خدمات ادامه دهید.'],
    en: ['Page not found', 'This address does not exist or has changed. Continue from the home page or service catalogue.'],
    ar: ['الصفحة غير موجودة', 'هذا العنوان غير موجود أو تغير. تابع من الصفحة الرئيسية أو قائمة الخدمات.'],
  }[lang];
  return (
    <main id="main-content" className="grid min-h-screen place-items-center bg-background px-6 py-20">
      <div className="max-w-lg text-center">
        <p aria-hidden="true" className="text-7xl font-light text-primary/30">404</p>
        <h1 className="mt-5 text-3xl font-bold">{copy[0]}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{copy[1]}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="rounded-full bg-primary px-6 py-3 font-semibold text-white">{t('nav.home')}</Link>
          <Link to="/services" className="rounded-full border border-border px-6 py-3 font-semibold">{t('nav.services')}</Link>
        </div>
      </div>
    </main>
  );
}
