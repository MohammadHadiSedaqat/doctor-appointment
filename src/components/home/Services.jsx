import { useI18n } from '@/i18n/I18nContext';
import AnimatedSection from '@/components/AnimatedSection';
import ServiceCard from '@/components/ServiceCard';
import { services } from '@/data/services';

export default function Services() {
  const { t } = useI18n();
  return (
    <section className="py-20" aria-labelledby="home-services-title">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 id="home-services-title" className="font-display text-3xl font-bold sm:text-4xl">{t('sections.servicesTitle')}</h2>
          <p className="mt-3 text-muted-foreground">{t('sections.servicesSub')}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => <AnimatedSection key={service.id} delay={i * 0.04}><ServiceCard service={service} /></AnimatedSection>)}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">{t('serviceCopy.priceNote')}</p>
      </div>
    </section>
  );
}
