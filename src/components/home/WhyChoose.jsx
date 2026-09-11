import React from "react";
import { Bone, ClipboardCheck, HeartHandshake, ScanLine, ShieldPlus, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function WhyChoose() {
  const { t } = useI18n();
  const icons = [Bone, ClipboardCheck, ScanLine, HeartHandshake, ShieldPlus, RefreshCw];
  const features = t("whyFeatures").map((feature, i) => ({ ...feature, icon: icons[i] }));
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sections.whyTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("sections.whySub")}</p>
        </AnimatedSection>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="group h-full rounded-3xl border border-border bg-white p-6 shadow-soft transition hover:shadow-card hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
