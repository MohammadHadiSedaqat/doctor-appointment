import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";
import { base44 } from "@/api/base44Client";
import { site } from "@/config/site";

const unavailable = { fa: "اطلاعات کلینیک پس از تأیید نهایی درج می‌شود.", en: "Clinic details will be published after final verification.", ar: "ستُنشر تفاصيل العيادة بعد التحقق النهائي." };

export default function Clinic() {
  const { t, lang, tr } = useI18n();
  const [images, setImages] = useState([]);
  useEffect(() => { base44.entities.GalleryImage.list().then((gallery) => setImages(gallery.filter((item) => (item.category === "clinic" || item.category === "equipment") && item.image_url))).catch(() => setImages([])); }, []);
  const address = site.address[lang] || site.city[lang] || site.address.en || site.city.en;
  const hours = Array.isArray(site.workingHours) ? site.workingHours : [];
  const hasDetails = address || site.phone || site.mapEmbedUrl || hours.length;
  return <div className="py-12"><div className="mx-auto max-w-7xl px-6"><AnimatedSection className="mx-auto max-w-2xl text-center"><h1 className="font-display text-4xl font-extrabold">{t("nav.clinic")}</h1><p className="mt-3 text-muted-foreground">{t("sections.gallerySub")}</p></AnimatedSection>
    {!!images.length && <AnimatedSection className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><h2 className="sr-only">{t("sections.galleryTitle")}</h2>{images.map((image, index) => <div key={image.id || index} className="aspect-video overflow-hidden rounded-2xl border border-border shadow-soft"><img src={image.image_url} alt={tr(image, "caption") || t("sections.galleryTitle")} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" /></div>)}</AnimatedSection>}
    {!hasDetails ? <AnimatedSection className="mx-auto mt-12 max-w-xl rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm leading-relaxed text-muted-foreground">{unavailable[lang] || unavailable.en}</AnimatedSection> : <AnimatedSection className="mt-12 grid gap-6 lg:grid-cols-2">{site.mapEmbedUrl && <div className="overflow-hidden rounded-3xl border border-border shadow-soft"><iframe title={t("sections.locationTitle")} className="h-80 w-full border-0" loading="lazy" src={site.mapEmbedUrl} /></div>}<div className={`rounded-3xl border border-border bg-white p-8 shadow-soft ${site.mapEmbedUrl ? "" : "lg:col-span-2"}`}><h2 className="font-display text-2xl font-bold">{t("sections.locationTitle")}</h2><div className="mt-5 space-y-4">{address && <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" /><span className="text-sm">{address}</span></div>}{site.phone && <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" aria-hidden="true" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} dir="ltr" className="text-sm hover:text-primary">{site.phone}</a></div>}{!!hours.length && <div className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" /><div className="grid gap-1 text-sm">{hours.map((item, index) => { const day = typeof item.day === "object" ? item.day[lang] || item.day.en : item.day; return <div key={item.id || index} className="flex justify-between gap-4"><span>{day}</span><span>{item.time || item.hours}</span></div>; })}</div></div>}</div>{site.mapUrl && <a href={site.mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-soft"><Navigation className="h-4 w-4" aria-hidden="true" />{t("common.directions")}</a>}</div></AnimatedSection>}
  </div></div>;
}
