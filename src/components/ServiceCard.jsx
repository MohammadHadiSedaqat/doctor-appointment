import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Bone, Syringe, ClipboardCheck } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { formatPrice } from '@/lib/format';

export default function ServiceCard({ service }) {
  const { t, tr, lang } = useI18n();
  const Icon = service.id === 'orthopedic-injection' ? Syringe : service.id === 'lab-review' ? ClipboardCheck : Bone;
  return (
    <Link to={`/services/${service.slug || service.id}`} className="group flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft"><Icon className="h-6 w-6" aria-hidden="true" /></span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs leading-relaxed text-muted-foreground"><Clock className="me-1 inline h-3 w-3" aria-hidden="true" />{t('serviceCopy.approximate')} {formatPrice(service.duration_minutes, lang)} {t('serviceCopy.minutes')}</span>
      </div>
      <h3 className="mt-5 font-display text-lg font-bold">{tr(service, 'name')}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tr(service, 'description')}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="font-bold text-primary">{formatPrice(service.base_price, lang)} <span className="text-xs font-normal">{t('common.currency')}</span></span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary">{t('serviceCopy.details')}<ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
