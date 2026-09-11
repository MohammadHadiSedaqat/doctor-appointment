import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Stethoscope, CalendarHeart } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/lib/AuthContext";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/config/site";

export default function PublicHeader() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const specialty = site.specialty[lang] || site.specialty.en;
  const menuLabel = { fa: "باز کردن منو", en: "Open menu", ar: "فتح القائمة" }[lang] || "Open menu";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    { to: "/qualifications", label: t("nav.qualifications") },
    { to: "/clinic", label: t("nav.clinic") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/contact", label: t("nav.contact") },
  ];
  const isActive = (to) => to === "/" ? location.pathname === "/" : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const NavLinks = ({ mobile = false }) => (
    <nav aria-label={t("nav.home")} className={mobile ? "flex flex-col gap-1" : "hidden items-center gap-1 lg:flex"}>
      {links.map((link) => (
        <Link key={link.to} to={link.to} aria-current={isActive(link.to) ? "page" : undefined} className={`${mobile ? "rounded-xl px-4 py-3 text-base" : "relative rounded-full px-3.5 py-2 text-sm"} font-medium transition ${isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
          {link.label}
          {!mobile && isActive(link.to) && <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-primary/10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "glass border-b border-border shadow-soft" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label={site.name[lang] || site.name.en}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft"><Stethoscope className="h-5 w-5" aria-hidden="true" /></div>
            <div className="min-w-0 max-w-[42vw] leading-tight"><div className="truncate font-display text-base font-bold text-foreground">{site.name[lang] || site.name.en}</div><div className="hidden truncate text-[11px] text-muted-foreground sm:block">{specialty}</div></div>
          </Link>
          <NavLinks />
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <Link to="/appointment" className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.02] hover:shadow-glow sm:flex"><CalendarHeart className="h-4 w-4" aria-hidden="true" />{t("nav.appointment")}</Link>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hidden px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary sm:block">{isAuthenticated ? t("nav.dashboard") : t("nav.login")}</Link>
            <Sheet>
              <SheetTrigger asChild><button type="button" aria-label={menuLabel} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/70 lg:hidden"><Menu className="h-5 w-5" aria-hidden="true" /></button></SheetTrigger>
              <SheetContent side="right" className="w-80 max-w-[85vw] p-6 pt-20">
                <SheetTitle className="sr-only">{site.name[lang] || site.name.en}</SheetTitle><SheetDescription className="sr-only">{specialty}</SheetDescription>
                <nav aria-label={t("nav.home")} className="flex flex-col gap-1">{links.map((link) => <SheetClose asChild key={link.to}><Link to={link.to} aria-current={isActive(link.to) ? "page" : undefined} className={`rounded-xl px-4 py-3 text-base font-medium transition ${isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"}`}>{link.label}</Link></SheetClose>)}</nav>
                <SheetClose asChild><Link to="/appointment" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-white"><CalendarHeart className="h-4 w-4" aria-hidden="true" />{t("nav.appointment")}</Link></SheetClose>
                <SheetClose asChild><Link to={isAuthenticated ? "/dashboard" : "/login"} className="mt-2 flex items-center justify-center rounded-xl border border-border px-4 py-3 font-medium">{isAuthenticated ? t("nav.dashboard") : t("nav.login")}</Link></SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
