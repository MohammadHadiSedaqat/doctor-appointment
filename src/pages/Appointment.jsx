import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, CalendarHeart, LogIn, Receipt } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/lib/AuthContext";
import { formatPrice, formatDate } from "@/lib/format";
import { calculatePrice, findRule, isRuleActive } from "@/lib/pricing";
import { services as serviceCatalog, getService } from "@/data/services";
import { buildSlots, upcomingDates, validPatientDetails } from "@/lib/booking";

const STEPS = 7;

export default function Appointment() {
  const { t, lang, tr } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const services = serviceCatalog;
  const [remoteServices, setRemoteServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [rules, setRules] = useState([]);
  const [hours, setHours] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityError, setAvailabilityError] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [patientError, setPatientError] = useState(false);
  const [reload, setReload] = useState(0);
  const [sel, setSel] = useState({ serviceId: params.get("service") || "", date: "", time: "", insuranceId: "", notes: "" });
  const [patientForm, setPatientForm] = useState({ first_name: "", last_name: "", mobile: "", email: "" });

  const copy = lang === 'fa' ? {
    unavailable: 'نوبت‌دهی آنلاین هنوز فعال نشده است. خدمات را می‌توانید بررسی کنید؛ برای هماهنگی نوبت از بخش تماس استفاده کنید.',
    loadError: 'اطلاعات نوبت‌دهی دریافت نشد. زمان خالی یا نوبت قطعی نمایش داده نمی‌شود.',
    availabilityError: 'امکان بررسی زمان‌های خالی وجود ندارد. لطفاً دوباره تلاش کنید.',
    preview: 'این خدمت فعلاً برای معرفی نمایش داده می‌شود و نوبت آنلاین آن فعال نیست.',
    patientError: 'اطلاعات پرونده دریافت نشد. لطفاً دوباره تلاش کنید.',
    details: 'نام، نام خانوادگی و شماره همراه معتبر ایران الزامی است. ایمیل اختیاری است.',
    retry: 'تلاش دوباره', contact: 'ارتباط با مطب', review: 'مرور اطلاعات',
    estimate: 'هزینه نمایش‌داده‌شده برآورد اولیه است؛ مبلغ نهایی باید توسط مطب تأیید شود.',
  } : lang === 'ar' ? {
    unavailable: 'الحجز عبر الإنترنت غير مفعّل بعد. استعرض الخدمات وتواصل مع العيادة لتنسيق الموعد.',
    loadError: 'تعذر تحميل معلومات الحجز. لا توجد أوقات متاحة مؤكدة.',
    availabilityError: 'تعذر التحقق من الأوقات المتاحة. يرجى المحاولة مجدداً.',
    preview: 'هذه الخدمة للعرض حالياً؛ الحجز عبر الإنترنت غير مفعّل.',
    patientError: 'تعذر تحميل ملف المريض. يرجى المحاولة مجدداً.',
    details: 'الاسم واللقب ورقم جوال إيراني صالح مطلوبة. البريد الإلكتروني اختياري.',
    retry: 'إعادة المحاولة', contact: 'اتصل بالعيادة', review: 'مراجعة المعلومات',
    estimate: 'التكلفة تقديرية وتتطلب تأكيد العيادة.',
  } : {
    unavailable: 'Online booking is not active yet. Browse the services and contact the clinic to arrange an appointment.',
    loadError: 'Booking information could not be loaded. No available or confirmed times can be shown.',
    availabilityError: 'Available times could not be verified. Please try again.',
    preview: 'This service is currently for information; online booking is not active.',
    patientError: 'Your patient record could not be loaded. Please try again.',
    details: 'First name, last name and a valid Iranian mobile number are required. Email is optional.',
    retry: 'Try again', contact: 'Contact the clinic', review: 'Review details',
    estimate: 'This is an estimate; the final fee must be confirmed by the clinic.',
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDataError(false);
    setAvailabilityDate("");
    Promise.all([
      base44.entities.Service.list(),
      base44.entities.InsuranceProvider.list(),
      base44.entities.InsurancePricingRule.list(),
      base44.entities.WorkingHours.list(),
    ]).then(([remote, insurance, pricing, workingHours]) => {
      if (cancelled) return;
      const active = remote.filter((item) => item.is_active !== false && item.active !== false);
      setRemoteServices(active);
      setProviders(insurance.filter((item) => item.is_active !== false && item.active !== false));
      setRules(pricing);
      setHours(workingHours);
      // Catalogue links can resolve to a real backend record by its exact name.
      setSel((previous) => {
        if (getService(previous.serviceId)) return previous;
        const remote = active.find((item) => item.id === previous.serviceId);
        const match = remote && serviceCatalog.find((item) => item.name_fa === remote.name_fa);
        return match ? { ...previous, serviceId: match.id, time: "" } : previous;
      });
    }).catch(() => {
      if (cancelled) return;
      setDataError(true);
      setRemoteServices([]);
      setHours([]);
      setProviders([]);
      setRules([]);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    setAvailabilityDate("");
    setAvailabilityError(false);
    setAppointments([]);
    setAvailabilityLoading(false);
    if (!sel.date || dataError || !hours.length) return;
    setAvailabilityLoading(true);
    base44.entities.Appointment.filter({ date: sel.date }).then((records) => {
      if (!cancelled) { setAppointments(records); setAvailabilityDate(sel.date); }
    }).catch(() => { if (!cancelled) setAvailabilityError(true); })
      .finally(() => { if (!cancelled) setAvailabilityLoading(false); });
    return () => { cancelled = true; };
  }, [sel.date, hours, dataError, reload]);

  useEffect(() => {
    let cancelled = false;
    setPatientError(false);
    if (!isAuthenticated || !user) return;
    base44.entities.Patient.filter({ created_by_id: user.id }).then((records) => {
      if (cancelled || !records[0]) return;
      const patient = records[0];
      setPatientForm({ first_name: patient.first_name || '', last_name: patient.last_name || '', mobile: patient.mobile || '', email: patient.email || '' });
    }).catch(() => { if (!cancelled) setPatientError(true); });
    return () => { cancelled = true; };
  }, [isAuthenticated, user, reload]);

  const service = services.find((item) => item.id === sel.serviceId) || getService(sel.serviceId);
  const remoteService = remoteServices.find((item) => item.id === sel.serviceId || (service && item.name_fa === service.name_fa));
  const duration = service?.duration_minutes || 30;
  const slots = useMemo(() => availabilityDate === sel.date && !availabilityError && !availabilityLoading
    ? buildSlots({ date: sel.date, duration, hours, appointments }) : [],
  [sel.date, duration, hours, appointments, availabilityDate, availabilityError, availabilityLoading]);
  const dates = upcomingDates();
  const selectedSlotAvailable = Boolean(slots.find((slot) => slot.time === sel.time && !slot.taken));
  const rule = useMemo(() => findRule(rules.filter((item) => isRuleActive(item)), sel.serviceId, sel.insuranceId || null), [sel.serviceId, sel.insuranceId, rules]);
  const result = service ? calculatePrice(service.base_price, rule) : null;
  const returnTo = encodeURIComponent(`/appointment?service=${encodeURIComponent(sel.serviceId)}`);

  const canNext = () => {
    if (step === 0) return Boolean(service && remoteService && !dataError && hours.length);
    if (step === 1) return Boolean(sel.date);
    if (step === 2) return selectedSlotAvailable;
    if (step === 4) return isAuthenticated && !patientError && validPatientDetails(patientForm);
    return Boolean(remoteService && selectedSlotAvailable);
  };

  // Booking must be committed atomically with server-side availability and price
  // validation. No backend function exists yet: do not write client-priced records
  // or submit catalogue preview IDs to the live medical database.
  if (loading) return <div role="status" className="grid min-h-[60vh] place-items-center"><span>{t("common.loading")}</span></div>;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-center font-display text-3xl font-extrabold">{t("appointment.title")}</h1>
        <div role="status" className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-7">
          <p>{copy.unavailable}</p>
          <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">{copy.contact}</Link>
        </div>
        {dataError && <div role="alert" className="mt-4 rounded-xl border p-4 text-sm"><p>{copy.loadError}</p><button onClick={() => setReload((value) => value + 1)} className="mt-2 font-semibold text-primary">{copy.retry}</button></div>}

        {/* stepper */}
        <div aria-label={copy.review} className="mt-8 flex items-center justify-between">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} aria-current={step === i ? "step" : undefined} className="flex flex-1 items-center">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition ${i <= step ? "bg-gradient-to-br from-primary to-secondary text-white" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS - 1 && <div className={`h-1 flex-1 rounded-full transition ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <button key={s.id} onClick={() => setSel({ ...sel, serviceId: s.id, time: "" })} aria-pressed={sel.serviceId === s.id} className={`rounded-2xl border p-4 text-start transition ${sel.serviceId === s.id ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/30"}`}>
                      <div className="font-display font-semibold">{tr(s, "name")}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{formatPrice(s.base_price, lang)} {t("common.currency")} · {s.duration_minutes}{lang === "fa" ? "د" : "m"}</div>
                    </button>
                  ))}
                  {service && !remoteService && <p className="col-span-full text-sm text-muted-foreground">{copy.preview}</p>}
                </div>
              )}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {dates.map((d) => (
                    <button key={d} onClick={() => setSel({ ...sel, date: d, time: "" })} aria-pressed={sel.date === d} className={`rounded-xl border p-3 text-center transition ${sel.date === d ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"}`}>
                      <div className="text-xs">{formatDate(d, lang)}</div>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {availabilityError && <div role="alert" className="col-span-full text-sm"><p>{copy.availabilityError}</p><button onClick={() => setReload((value) => value + 1)} className="mt-2 text-primary">{copy.retry}</button></div>}
                  {availabilityLoading && <p role="status" className="col-span-full text-center text-sm">{t("common.loading")}</p>}
                  {slots.length ? slots.map((s) => (
                    <button key={s.time} disabled={s.taken} onClick={() => setSel({ ...sel, time: s.time })} aria-pressed={sel.time === s.time} className={`rounded-xl border py-2.5 text-sm font-medium transition ${s.taken ? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground line-through" : sel.time === s.time ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30"}`}>
                      {s.time}
                    </button>
                  )) : !availabilityLoading && !availabilityError && <p className="col-span-full text-center text-sm text-muted-foreground">{t("appointment.noSlots")}</p>}
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <button onClick={() => setSel({ ...sel, insuranceId: "" })} className={`rounded-2xl border p-4 text-start transition ${!sel.insuranceId ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <div className="font-display font-semibold">{t("appointment.selfPay")}</div>
                  </button>
                  {providers.map((p) => (
                    <button key={p.id} onClick={() => setSel({ ...sel, insuranceId: p.id })} className={`rounded-2xl border p-4 text-start transition ${sel.insuranceId === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <div className="font-display font-semibold">{tr(p, "name")}</div>
                    </button>
                  ))}
                </div>
              )}
              {step === 4 && (
                isAuthenticated ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { k: "first_name", label: t("appointment.firstName") },
                      { k: "last_name", label: t("appointment.lastName") },
                      { k: "mobile", label: t("appointment.mobile") },
                      { k: "email", label: t("appointment.email") },
                    ].map((f) => (
                      <div key={f.k}>
                        <label htmlFor={`booking-${f.k}`} className="mb-1.5 block text-sm font-medium">{f.label}</label>
                        <input id={`booking-${f.k}`} type={f.k === 'email' ? 'email' : f.k === 'mobile' ? 'tel' : 'text'} autoComplete={f.k === 'first_name' ? 'given-name' : f.k === 'last_name' ? 'family-name' : f.k === 'mobile' ? 'tel' : 'email'} maxLength={f.k === 'mobile' ? 20 : 120} required={f.k !== 'email'} aria-describedby="booking-details-help" value={patientForm[f.k]} onChange={(e) => setPatientForm({ ...patientForm, [f.k]: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-medium">{t("appointment.notes")}</label>
                      <textarea id="booking-notes" maxLength={2000} value={sel.notes} onChange={(e) => setSel({ ...sel, notes: e.target.value })} rows={2} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <p id="booking-details-help" className="text-sm text-muted-foreground sm:col-span-2">{copy.details}</p>
                    {patientError && <p role="alert" className="text-sm text-destructive sm:col-span-2">{copy.patientError} <button onClick={() => setReload((value) => value + 1)} className="underline">{copy.retry}</button></p>}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                    <LogIn className="mx-auto h-10 w-10 text-primary" />
                    <p className="mt-3 font-display font-semibold">{t("auth.login")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("auth.noAccount")}</p>
                    <div className="mt-5 flex justify-center gap-3">
                      <Link to={`/login?returnTo=${returnTo}`} className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white">{t("auth.loginBtn")}</Link>
                      <Link to={`/register?returnTo=${returnTo}`} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold">{t("auth.registerBtn")}</Link>
                    </div>
                  </div>
                )
              )}
              {step === 5 && result && (
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="flex items-center gap-2 bg-muted/50 px-5 py-3 text-sm font-semibold text-primary"><Receipt className="h-4 w-4" />{copy.review}</div><p className="px-5 py-3 text-sm text-muted-foreground">{copy.estimate}</p>
                  <div className="divide-y divide-border">
                    <SummaryRow label={t("appointment.service")} value={service ? tr(service, "name") : ""} />
                    <SummaryRow label={t("appointment.date")} value={formatDate(sel.date, lang)} />
                    <SummaryRow label={t("appointment.time")} value={sel.time} />
                    <SummaryRow label={t("appointment.insurance")} value={sel.insuranceId ? tr(providers.find((p) => p.id === sel.insuranceId), "name") : t("appointment.selfPay")} />
                    <SummaryRow label={t("pricing.base")} value={`${formatPrice(result.base, lang)} ${t("common.currency")}`} />
                    <SummaryRow label={t("pricing.deduction")} value={`- ${formatPrice(result.deduction, lang)} ${t("common.currency")}`} />
                    <div className="flex items-center justify-between bg-primary/5 px-5 py-4">
                      <span className="font-display font-bold">{t("pricing.final")}</span>
                      <span className="font-display text-xl font-extrabold text-primary">{formatPrice(result.final, lang)} {t("common.currency")}</span>
                    </div>
                  </div>
                </div>
              )}
              {step === 6 && (
                <div className="text-center">
                  <CalendarHeart className="mx-auto h-12 w-12 text-primary" />
                  <p className="mt-4 font-display text-lg font-semibold">{copy.unavailable}</p><Link to="/contact" className="mt-4 inline-block text-primary underline">{copy.contact}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{service ? tr(service, "name") : ""} · {formatDate(sel.date, lang)} · {sel.time}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1 rounded-full border border-border px-5 py-2.5 text-sm font-semibold disabled:opacity-40">
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />{t("appointment.prev")}
              </button>
              {step < STEPS - 1 ? (
                <button onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()} className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-40">
                  {t("appointment.next")}<ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              ) : (
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-soft">{copy.contact}</Link>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}