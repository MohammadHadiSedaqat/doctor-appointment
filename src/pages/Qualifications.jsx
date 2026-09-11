import { Link } from 'react-router-dom';
import { GraduationCap, Bone, Clock, BadgeCheck } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { site } from '@/config/site';

export default function Qualifications() {
  const { t } = useI18n();
  const credentials = [
    { icon: GraduationCap, title: t('profileCopy.degree') },
    { icon: Bone, title: t('profileCopy.specialty') },
    { icon: Clock, title: t('profileCopy.experience'), description: t('profileCopy.experienceDesc') },
  ];
  return (
    <article className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl font-extrabold leading-relaxed">{t('profileCopy.credentials')}</h1>
      <p className="mt-3 text-muted-foreground">{t('profileCopy.credentialsIntro')}</p>
      <div className="mt-10 space-y-4">
        {credentials.map(({ icon: Icon, title, description }) => <section key={title} className="flex items-start gap-4 rounded-3xl border border-border bg-white p-6 shadow-soft"><Icon className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-lg font-bold">{title}</h2>{description && <p className="mt-2 text-muted-foreground">{description}</p>}</div></section>)}
        {site.medicalLicense && <p className="flex items-center gap-3 rounded-3xl border border-border p-6"><BadgeCheck aria-hidden="true" />{t('profileCopy.license')}: {site.medicalLicense}</p>}
      </div>
      <Link to="/about" className="mt-8 inline-block text-primary underline underline-offset-4">{t('profileCopy.about')}</Link>
    </article>
  );
}
