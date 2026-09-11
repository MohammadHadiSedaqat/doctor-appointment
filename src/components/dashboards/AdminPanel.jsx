import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, DollarSign, Stethoscope, ShieldCheck, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/i18n/I18nContext";
import StatCard from "./StatCard";
import { formatPrice } from "@/lib/format";

export default function AdminPanel({ section }) {
  const { t, lang } = useI18n();
  const [data, setData] = useState({ appts: [], patients: [], services: [], providers: [], msgs: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    (async () => {
      try {
      const [appts, patients, services, providers, msgs] = await Promise.all([
        base44.entities.Appointment.list(),
        base44.entities.Patient.list(),
        base44.entities.Service.list(),
        base44.entities.InsuranceProvider.list(),
        base44.entities.ContactMessage.list(),
      ]);
      if (!cancelled) setData({ appts, patients, services, providers, msgs });
      } catch { if (!cancelled) setLoadError(true); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [reload]);

  if (loadError) return <div role="alert" className="rounded-2xl border p-6 text-sm"><p>اطلاعات دریافت نشد؛ خالی بودن این بخش به معنی نبودن پرونده یا نوبت نیست.</p><button onClick={() => setReload((value) => value + 1)} className="mt-4 text-primary underline">تلاش دوباره</button></div>;
  if (loading) return <div className="grid h-64 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

  const revenue = data.appts.filter((a) => a.status === "completed" && a.payment_status === "paid").reduce((s, a) => s + (a.final_amount || 0), 0);
  const unread = data.msgs.filter((m) => m.status === "unread").length;

  if (section === "messages") return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("sections.contactTitle")}</h1>
      <div className="space-y-3">
        {data.msgs.length ? data.msgs.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{m.name}</div>
              <span className={`rounded-full px-2.5 py-1 text-xs ${m.status === "unread" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{m.status}</span>
            </div>
            <div className="text-sm text-muted-foreground" dir="ltr">{m.phone} · {m.email}</div>
            <p className="mt-2 text-sm">{m.message}</p>
          </div>
        )) : <div className="grid place-items-center rounded-2xl border border-dashed border-border py-12 text-sm text-muted-foreground">{t("common.noData")}</div>}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.overview")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label={t("dash.appointments")} value={data.appts.length} color="primary" />
        <StatCard icon={Users} label={t("dash.patients")} value={data.patients.length} color="secondary" delay={0.05} />
        <StatCard icon={DollarSign} label={t("dash.revenue")} value={revenue} color="success" delay={0.1} />
        <StatCard icon={FileText} label={t("dash.notifications")} value={unread} color="warning" delay={0.15} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Stethoscope, label: t("nav.services"), count: data.services.length, color: "text-primary bg-primary/10" },
          { icon: ShieldCheck, label: t("sections.insuranceTitle"), count: data.providers.length, color: "text-accent bg-accent/10" },
          { icon: Users, label: t("dash.patients"), count: data.patients.length, color: "text-secondary bg-secondary/10" },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.color}`}><c.icon className="h-6 w-6" /></div>
            <div>
              <div className="font-display text-2xl font-bold">{c.count}</div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-display font-bold">{t("dash.appointments")}</h3>
        <div className="space-y-2">
          {data.appts.slice(0, 6).map((a) => {
            const p = data.patients.find((x) => x.id === a.patient_id);
            return (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span className="font-medium">{p ? `${p.first_name} ${p.last_name}` : a.appointment_id}</span>
                <span className="text-muted-foreground">{a.date} · {a.time}</span>
                <span className="font-semibold text-primary">{formatPrice(a.final_amount, lang)}</span>
              </div>
            );
          })}
          {!data.appts.length && <div className="py-6 text-center text-sm text-muted-foreground">{t("common.noData")}</div>}
        </div>
      </div>
    </div>
  );
}