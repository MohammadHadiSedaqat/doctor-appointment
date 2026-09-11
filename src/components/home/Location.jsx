import React from "react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";
import { site } from "@/config/site";

const unavailable = { fa: "آدرس و ساعات پذیرش پس از تأیید کلینیک اعلام می‌شود.", en: "The clinic address and hours will be published after verification.", ar: "سيتم نشر عنوان العيادة وساعات العمل بعد التحقق." };

export default function Location() {
  const { t, lang } = useI18n();
  const address = site.address[lang] || site.city[lang] || site.address.en || site.city.en;
  const hours = Array.isArray(site.workingHours) ? site.workingHours : [];
  const hasDetails = address || site.phone || site.mapEmbedUrl || hours.length;
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center"><h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sections.locationTitle")}</h2><p className="mt-3 text-muted-foreground">{t("sections.locationSub")}</p></AnimatedSection>
        {!hasDetails ? <AnimatedSection className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm leading-relaxed text-muted-foreground">{unavailable[lang] || unavailable.en}</AnimatedSection> : <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {site.mapEmbedUrl && <AnimatedSection className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft"><div className="h-72 w-full lg:h-full"><iframe title={t("sections.locationTitle")} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={site.mapEmbedUrl} /></div></AnimatedSection>}
          <AnimatedSection delay={0.1} className={`rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8 ${site.mapEmbedUrl ? "" : "lg:col-span-2"}`}>
            <div className="space-y-5">
              {address && <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" aria-hidden="true" /></div><div><div className="font-display font-semibold">{t("footer.address")}</div><div className="text-sm text-muted-foreground">{address}</div></div></div>}
              {site.phone && <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-secondary"><Phone className="h-5 w-5" aria-hidden="true" /></div><div><div className="font-display font-semibold">{t("footer.contact")}</div><a href={`tel:${site.phone.replace(/\s/g, "")}`} dir="ltr" className="text-sm text-muted-foreground hover:text-primary">{site.phone}</a></div></div>}
              {!!hours.length && <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><Clock className="h-5 w-5" aria-hidden="true" /></div><div className="flex-1"><div className="mb-2 font-display font-semibold">{t("nav.appointment")}</div><div className="grid gap-1.5 text-sm">{hours.map((item, i) => { const day = typeof item.day === "object" ? (item.day[lang] || item.day.en) : item.day; return <div key={item.id || i} className="flex justify-between gap-4 text-muted-foreground"><span>{day}</span><span>{item.time || item.hours}</span></div>; })}</div></div></div>}
              {(site.mapUrl || site.phone) && <div className="flex flex-wrap gap-3 pt-2">{site.mapUrl && <a href={site.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow"><Navigation className="h-4 w-4" aria-hidden="true" />{t("common.directions")}</a>}{site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40"><Phone className="h-4 w-4 text-primary" aria-hidden="true" />{t("common.call")}</a>}</div>}
            </div>
          </AnimatedSection>
        </div>}
      </div>
    </section>
  );
}
