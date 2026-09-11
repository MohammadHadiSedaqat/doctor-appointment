import React from "react";
import { Link } from "react-router-dom";
import { CalendarHeart, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function CTA() {
  const { t } = useI18n();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-secondary p-10 text-center text-white shadow-card sm:p-16">
          <div className="absolute inset-0 bg-mesh opacity-20" />
          <div className="absolute -top-10 -end-10 h-40 w-40 rounded-full bg-white/10 blur-2xl animate-pulse-ring" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sections.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">{t("sections.ctaSub")}</p>
            <Link to="/appointment" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-primary shadow-soft transition hover:scale-[1.03]">
              <CalendarHeart className="h-5 w-5" />
              {t("common.book")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}