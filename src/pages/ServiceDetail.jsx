import { useParams, Link } from 'react-router-dom';
import { Bone, CalendarHeart, Clock } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { getService } from '@/data/services';
import { formatPrice } from '@/lib/format';

export default function ServiceDetail() {
  const { id } = useParams();
  const { t, lang, tr } = useI18n();
  const service = getService(id);
  if (!service) return <div className="mx-auto max-w-4xl px-6 py-20"><h1 className="text-3xl font-bold">{t('serviceCopy.notFound')}</h1><Link to="/services" className="mt-6 inline-block text-primary underline">{t('serviceCopy.all')}</Link></div>;
  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label={lang === 'fa' ? 'مسیر صفحه' : lang === 'ar' ? 'مسار الصفحة' : 'Breadcrumb'} className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <Link to="/">{t('nav.home')}</Link><span aria-hidden="true">/</span><Link to="/services">{t('nav.services')}</Link><span aria-hidden="true">/</span><span aria-current="page">{tr(service, 'name')}</span>
      </nav>
      <div className="rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-10">
        <Bone className="mb-5 h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="font-display text-3xl font-extrabold leading-relaxed">{tr(service, 'name')}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{tr(service, 'description')}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2"><Clock className="h-4 w-4" aria-hidden="true" />{t('serviceCopy.approximate')} {formatPrice(service.duration_minutes, lang)} {t('serviceCopy.minutes')}</span>
          <span className="rounded-full bg-primary/10 px-4 py-2 text-primary">{t('serviceCopy.provisional')}: {formatPrice(service.base_price, lang)} {t('common.currency')}</span>
        </div>
        <h2 className="mt-10 text-xl font-bold">{t('serviceCopy.preparing')}</h2>
        <p className="mt-3 leading-loose text-muted-foreground">{tr(service, 'detail')}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t('serviceCopy.priceNote')}</p>
        <Link to={`/appointment?service=${service.id}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white"><CalendarHeart className="h-5 w-5" aria-hidden="true" />{t('common.book')}</Link>
      </div>
    </article>
  );
}
