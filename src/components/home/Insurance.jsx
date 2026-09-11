import React from "react";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function Insurance({ providers }) {
  const { t, tr } = useI18n();
  const list = (providers || []).filter((provider) => provider.active && tr(provider, "name")).slice(0, 8);
  if (!list.length) return null;
  return <section className="bg-muted/30 py-20" aria-labelledby="insurance-title"><div className="mx-auto max-w-7xl px-6"><AnimatedSection className="mx-auto max-w-2xl text-center"><div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent"><ShieldCheck className="h-4 w-4" aria-hidden="true" />{t("sections.insuranceSub")}</div><h2 id="insurance-title" className="mt-4 font-display text-3xl font-bold sm:text-4xl">{t("sections.insuranceTitle")}</h2></AnimatedSection><div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{list.map((provider, index) => <AnimatedSection key={provider.id || index} delay={index * 0.05}><div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 text-accent transition group-hover:scale-110"><ShieldCheck className="h-7 w-7" aria-hidden="true" /></div><div className="mt-3 font-display font-semibold">{tr(provider, "name")}</div><span className="mt-1.5 inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">{t("common.confirmed")}</span></div></AnimatedSection>)}</div></div></section>;
}
