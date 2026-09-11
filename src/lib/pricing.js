// Insurance-based price calculation engine.
// Reads configuration from DB (InsurancePricingRule) — never hard-codes prices.
// NOTE: For full security, final price must be re-validated server-side via a backend
// function (Builder+). This client helper mirrors that logic for live preview.
export function calculatePrice(basePrice, rule) {
  if (!rule) return { base: basePrice, deduction: 0, final: basePrice };
  const fixed = Number(rule.fixed_deduction) || 0;
  const pct = Number(rule.percentage_deduction) || 0;
  const pctAmount = (basePrice * pct) / 100;
  const deduction = Math.min(fixed + pctAmount, basePrice);
  const final = Math.max(basePrice - deduction, 0);
  return { base: basePrice, deduction, final };
}

export function isRuleActive(rule, today = new Date()) {
  if (!rule) return false;
  if (rule.active === false) return false;
  if (rule.effective_date && new Date(rule.effective_date) > today) return false;
  if (rule.expiration_date && new Date(rule.expiration_date) < today) return false;
  return true;
}

export function findRule(rules, serviceId, insuranceId) {
  return rules.find(
    (r) => r.service_id === serviceId && (insuranceId ? r.insurance_provider_id === insuranceId : !r.insurance_provider_id)
  );
}