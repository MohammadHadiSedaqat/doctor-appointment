import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function FAQ({ faqs }) {
  const { t, tr } = useI18n();
  const [open, setOpen] = useState(null);
  const list = (faqs || []).filter((faq) => faq.active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).slice(0, 8);
  if (!list.length) return null;
  return <section className="py-20" aria-labelledby="faq-title"><div className="mx-auto max-w-3xl px-6"><AnimatedSection className="text-center"><h2 id="faq-title" className="font-display text-3xl font-bold sm:text-4xl">{t("sections.faqTitle")}</h2><p className="mt-3 text-muted-foreground">{t("sections.faqSub")}</p></AnimatedSection><div className="mt-10 space-y-3">{list.map((faq, index) => { const expanded = open === index; const answerId = `faq-answer-${faq.id || index}`; return <AnimatedSection key={faq.id || index} delay={index * 0.04}><div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft"><button type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(expanded ? null : index)} className="flex w-full items-center justify-between gap-4 p-5 text-start"><span className="font-display font-semibold">{tr(faq, "question")}</span><ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${expanded ? "rotate-180" : ""}`} aria-hidden="true" /></button><div id={answerId} hidden={!expanded} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{tr(faq, "answer")}</p></div></div></AnimatedSection>; })}</div></div></section>;
}
