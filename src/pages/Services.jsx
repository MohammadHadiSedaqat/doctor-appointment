import { useI18n } from '@/i18n/I18nContext';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/services';

export default function Services() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <AnimatedSection className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold">{t('sections.servicesTitle')}</h1>
        <p className="mt-3 text-muted-foreground">{t('sections.servicesSub')}</p>
      </AnimatedSection>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(service => <ServiceCard key={service.id} service={service} />)}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">{t('serviceCopy.priceNote')}</p>
    </div>
  );
}
