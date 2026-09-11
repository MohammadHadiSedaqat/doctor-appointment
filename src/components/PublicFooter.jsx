import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { site, getClinicAddress, getClinicPhoneHref } from "@/config/site";
import { formatDigits } from "@/lib/format";
import WorkingHours from "@/components/WorkingHours";

const socialIcons = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin };

export default function PublicFooter() {
  const { t, lang } = useI18n();
  const name = site.name[lang] || site.name.en;
  const address = getClinicAddress(lang);
  const contactItems = [
    site.phone && { icon: Phone, value: formatDigits(site.phone, lang), href: getClinicPhoneHref() },
    site.email && { icon: Mail, value: site.email, href: `mailto:${site.email}` },
    address && { icon: MapPin, value: address },
  ].filter(Boolean);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-gradient-to-b from-background to-muted/40">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white"><Stethoscope className="h-5 w-5" aria-hidden="true" /></div><div className="font-display font-bold">{name}</div></div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("hero.intro")}</p>
            {!!site.socialLinks.length && <div className="mt-5 flex gap-2">{site.socialLinks.map((item) => { const Icon = socialIcons[item.platform] || null; return Icon ? <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" aria-label={item.platform} className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-muted-foreground transition hover:border-primary/40 hover:text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></a> : null; })}</div>}
          </div>
          <div>
            <h4 className="font-display font-semibold">{t("footer.quickLinks")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">{[{ to: "/about", label: t("nav.about") }, { to: "/services", label: t("nav.services") }, { to: "/clinic", label: t("nav.clinic") }, { to: "/appointment", label: t("nav.appointment") }, { to: "/pricing", label: t("nav.pricing") }, { to: "/privacy", label: ({ fa: "حریم خصوصی و استفاده از سایت", en: "Privacy and Website Use", ar: "الخصوصية واستخدام الموقع" }[lang] || "Privacy and Website Use") }].map((link) => <li key={link.to}><Link to={link.to} className="transition hover:text-primary">{link.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="font-display font-semibold">{t("footer.contact")}</h4>
            {contactItems.length ? <ul className="mt-4 space-y-3 text-sm text-muted-foreground">{contactItems.map(({ icon: Icon, value, href }) => <li key={value} className="flex items-start gap-2.5"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{href ? <a href={href} dir="ltr" className="hover:text-primary">{value}</a> : <span>{value}</span>}</li>)}</ul> : <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{unavailable[lang] || unavailable.en}</p>}
          </div>
          <div>
            <WorkingHours className="mb-6" />
            <h4 className="font-display font-semibold">{t("nav.appointment")}</h4><p className="mt-4 text-sm text-muted-foreground">{t("sections.ctaSub")}</p><Link to="/appointment" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow">{t("common.book")}</Link>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} {name} — {t("footer.rights")}.</div>
      </div>
    </footer>
  );
}
