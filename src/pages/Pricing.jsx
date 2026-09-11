import React, { useEffect, useMemo, useState } from "react";
import { Calculator, Loader2, Receipt } from "lucide-react";
import { services as serviceCatalog } from "@/data/services";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";
import { formatPrice } from "@/lib/format";
import { calculatePrice, findRule, isRuleActive } from "@/lib/pricing";

export default function Pricing() {
  const { t, lang, tr } = useI18n();
  const services = serviceCatalog;
  const [providers, setProviders] = useState([]);
  const [rules, setRules] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, r] = await Promise.all([
        base44.entities.InsuranceProvider.list().catch(() => []),
        base44.entities.InsurancePricingRule.list().catch(() => []),
      ]);
      setProviders(p); setRules(r); setLoading(false);
    })();
  }, []);

  const service = services.find((s) => s.id === serviceId);
  const rule = useMemo(() => {
    if (!serviceId) return null;
    const today = new Date();
    return findRule(rules.filter((r) => isRuleActive(r, today)), serviceId, insuranceId || null);
  }, [serviceId, insuranceId, rules]);

  const result = service ? calculatePrice(service.base_price, rule) : null;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatedSection className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"><Calculator className="h-4 w-4" />{t("pricing.title")}</div>
          <h1 className="mt-4 font-display text-4xl font-extrabold">{t("pricing.title")}</h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mt-10 rounded-3xl border border-border bg-white p-8 shadow-card">
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{t("serviceCopy.priceNote")}</p>
          {!providers.length && !loading && <p className="mb-5 text-sm text-muted-foreground">{t("serviceCopy.noInsurance")}</p>}
          <div className="grid gap-5">
            <div>
              <label htmlFor="pricing-service" className="mb-2 block text-sm font-medium">{t("pricing.service")}</label>
              <select id="pricing-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">{t("appointment.selectService")}</option>
                {services.map((s) => <option key={s.id} value={s.id}>{tr(s, "name")} — {formatPrice(s.base_price, lang)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pricing-insurance" className="mb-2 block text-sm font-medium">{t("pricing.insurance")}</label>
              <select id="pricing-insurance" value={insuranceId} onChange={(e) => setInsuranceId(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="">{t("pricing.selfPay")}</option>
                {providers.map((p) => <option key={p.id} value={p.id}>{tr(p, "name")}</option>)}
              </select>
            </div>
          </div>

          {result && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/40 to-background">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-semibold text-primary"><Receipt className="h-4 w-4" />{t("serviceCopy.review")}</div>
              <div className="divide-y divide-border">
                <Row label={t("pricing.base")} value={`${formatPrice(result.base, lang)} ${t("common.currency")}`} />
                <Row label={t("pricing.deduction")} value={`- ${formatPrice(result.deduction, lang)} ${t("common.currency")}`} accent="text-success" />
                <div className="flex items-center justify-between bg-primary/5 px-5 py-4">
                  <span className="font-display font-bold">{t("pricing.final")}</span>
                  <span className="font-display text-2xl font-extrabold text-primary">{formatPrice(result.final, lang)} <span className="text-sm font-normal">{t("common.currency")}</span></span>
                </div>
              </div>
            </div>
          )}
          {loading && <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{t("common.loading")}</div>}
        </AnimatedSection>
      </div>
    </div>
  );
}

function Row({ label, value, accent = "" }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${accent || ""}`}>{value}</span>
    </div>
  );
}