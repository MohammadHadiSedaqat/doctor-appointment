import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, Clock, DollarSign, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/i18n/I18nContext";
import StatCard from "./StatCard";
import { formatPrice } from "@/lib/format";
import { clinicDateKey } from "@/lib/booking";

export default function DoctorPanel({ section }) {
  const { t, lang } = useI18n();
  const [appts, setAppts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    (async () => {
      try {
      const [a, p, v] = await Promise.all([
        base44.entities.Appointment.list(),
        base44.entities.Patient.list(),
        base44.entities.Visit.list(),
      ]);
      if (!cancelled) { setAppts(a); setPatients(p); setVisits(v); }
      } catch { if (!cancelled) setLoadError(true); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [reload]);

  if (loadError) return <div role="alert" className="rounded-2xl border p-6 text-sm"><p>اطلاعات دریافت نشد؛ خالی بودن این بخش به معنی نبودن پرونده یا نوبت نیست.</p><button onClick={() => setReload((value) => value + 1)} className="mt-4 text-primary underline">تلاش دوباره</button></div>;
  if (loading) return <div className="grid h-64 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

  const today = clinicDateKey();
  const todayAppts = appts.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const completed = appts.filter((a) => a.status === "completed" && a.payment_status === "paid");
  const revenue = completed.reduce((s, a) => s + (a.final_amount || 0), 0);
  const filteredPatients = patients.filter((p) => !query || `${p.first_name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase()) || p.mobile?.includes(query));

  if (section === "patients") return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.patients")}</h1>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("common.search")} className="w-full rounded-xl border border-input bg-background ps-9 pe-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">{p.first_name?.charAt(0)}</div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.first_name} {p.last_name}</div>
                <div className="text-xs text-muted-foreground" dir="ltr">{p.mobile}</div>
              </div>
            </div>
            <div className="mt-2 font-mono text-xs text-primary" dir="ltr">{p.patient_id}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section === "today") return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.today")}</h1>
      <div className="space-y-3">
        {todayAppts.length ? todayAppts.map((a) => {
          const p = patients.find((x) => x.id === a.patient_id);
          const statusColor = { confirmed: "bg-success/10 text-success", requested: "bg-warning/10 text-warning", completed: "bg-primary/10 text-primary", in_consultation: "bg-accent/10 text-accent" };
          return (
            <div key={a.id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="font-display text-lg font-bold text-primary" dir="ltr">{a.time}</div>
                <div>
                  <div className="font-semibold">{p ? `${p.first_name} ${p.last_name}` : a.appointment_id}</div>
                  <div className="text-xs text-muted-foreground">{a.appointment_id}</div>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[a.status] || ""}`}>{t(`common.${a.status}`)}</span>
            </div>
          );
        }) : <div className="grid place-items-center rounded-2xl border border-dashed border-border py-12 text-sm text-muted-foreground">{t("common.noData")}</div>}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.overview")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label={t("dash.today")} value={todayAppts.length} color="primary" />
        <StatCard icon={Users} label={t("dash.patients")} value={patients.length} color="secondary" delay={0.05} />
        <StatCard icon={Clock} label={t("dash.visits")} value={visits.length} color="accent" delay={0.1} />
        <StatCard icon={DollarSign} label={t("dash.revenue")} value={revenue} color="success" delay={0.15} />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-display font-bold">{t("dash.today")}</h3>
        <div className="space-y-3">
          {todayAppts.length ? todayAppts.map((a) => {
            const p = patients.find((x) => x.id === a.patient_id);
            return (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-primary" dir="ltr">{a.time}</span>
                  <span className="font-semibold">{p ? `${p.first_name} ${p.last_name}` : a.appointment_id}</span>
                </div>
                <span className="text-sm text-muted-foreground">{formatPrice(a.final_amount, lang)} {t("common.currency")}</span>
              </div>
            );
          }) : <div className="py-8 text-center text-sm text-muted-foreground">{t("common.noData")}</div>}
        </div>
      </div>
    </div>
  );
}