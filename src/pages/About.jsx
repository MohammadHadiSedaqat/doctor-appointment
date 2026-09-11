import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import DoctorPortrait from '@/components/DoctorPortrait';
import AnimatedSection from '@/components/AnimatedSection';
import { services } from '@/data/services';

export default function About() {
  const { t, tr } = useI18n();
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <AnimatedSection className="grid items-center gap-8 lg:grid-cols-3">
        <div className="w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-card"><DoctorPortrait /></div>
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary"><BadgeCheck className="h-4 w-4" aria-hidden="true" />{t('hero.badge')}</div>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-relaxed">{t('profileCopy.about')}</h1>
          <p className="mt-2 font-semibold text-secondary">{t('hero.specialty')}</p>
          <p className="mt-4 leading-loose text-muted-foreground">{t('hero.intro')}</p>
          <Link to="/qualifications" className="mt-4 inline-block text-primary underline underline-offset-4">{t('profileCopy.qualificationLink')}</Link>
        </div>
      </AnimatedSection>
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">{t('profileCopy.approach')}</h2>
        <p className="mt-4 leading-loose text-muted-foreground">{t('profileCopy.approachText')}</p>
      </section>
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{t('profileCopy.fields')}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {services.map(service => <li key={service.id}><Link to={`/services/${service.id}`} className="block rounded-2xl border border-border bg-white p-4 text-primary hover:bg-muted">{tr(service, 'name')}</Link></li>)}
        </ul>
      </section>
    </article>
  );
}
