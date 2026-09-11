import React from "react";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function Testimonials({ testimonials }) {
  const { t, tr } = useI18n();
  const list = (testimonials || []).filter((x) => x.approved && x.active).slice(0, 6);
  if (!list.length) return null;
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sections.testimonialsTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("sections.testimonialsSub")}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.06}>
              <div className="relative h-full rounded-3xl border border-border bg-white p-6 shadow-soft">
                <Quote aria-hidden="true" className="absolute top-6 end-6 h-8 w-8 text-primary/10" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-4 w-4 ${s < (item.rating || 5) ? "fill-warning text-warning" : "text-muted"}`} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/80">“{tr(item, "text")}”</blockquote>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                    {item.display_name?.trim()?.charAt(0) || "؟"}
                  </div>
                  <div className="font-display font-semibold">{item.display_name || t("common.patient")}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
