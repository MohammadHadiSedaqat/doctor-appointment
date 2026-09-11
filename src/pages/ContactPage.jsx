import React from "react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";
import Contact from "@/components/home/Contact";

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <AnimatedSection>
          <h1 className="font-display text-4xl font-extrabold">{t("sections.contactTitle")}</h1>
          <p className="mt-3 text-muted-foreground">{t("sections.contactSub")}</p>
        </AnimatedSection>
      </div>
      <div className="mt-8">
        <Contact showHeading={false} />
      </div>
    </div>
  );
}
