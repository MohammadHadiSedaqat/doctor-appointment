import React from "react";
import { Bone, ClipboardCheck, HeartPulse, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function Stats() {
  const { t } = useI18n();
  const icons = [Bone, ClipboardCheck, HeartPulse, RefreshCw];
  const items = t("highlights").map((item, i) => ({ icon: icons[i], label: item.title, detail: item.description }));

  return (
    <section className="relative -mt-8 z-10">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-white p-6 shadow-card sm:gap-6 lg:grid-cols-4 lg:p-8">
          {items.map((it, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition group-hover:scale-110">
                <it.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-base font-extrabold text-foreground sm:text-lg">{it.label}</div>
              <div className="mt-2 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">{it.detail}</div>
            </div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
