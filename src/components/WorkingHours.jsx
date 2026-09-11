import React from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { site } from '@/config/site';
import { formatDigits } from '@/lib/format';

export default function WorkingHours({ className = '' }) {
  const { t, lang } = useI18n();
  if (!site.workingHours.length) return null;
  const separator = { fa: ' تا ', en: '–', ar: ' إلى ' }[lang] || '–';

  return (
    <div className={className}>
      <h3 className="font-display text-sm font-semibold">{t('footer.hours')}</h3>
      <dl className="mt-2 grid gap-2 text-sm text-muted-foreground">
        {site.workingHours.map((period) => (
          <div key={period.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt>{period.day[lang] || period.day.en}</dt>
            <dd className="whitespace-nowrap">
              <time dateTime={period.opens}>{formatDigits(period.opens, lang)}</time>
              {separator}
              <time dateTime={period.closes}>{formatDigits(period.closes, lang)}</time>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
