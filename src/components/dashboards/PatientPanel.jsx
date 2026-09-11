import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarHeart, Clock, FileText, Pill, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/lib/AuthContext";
import StatCard from "./StatCard";
import { formatDate } from "@/lib/format";
import { isUpcomingAppointment, validPatientDetails } from "@/lib/booking";

export default function PatientPanel({ section }) {
  const { t, lang, tr } = useI18n();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appts, setAppts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    setPatient(null); setAppts([]); setVisits([]); setPrescriptions([]); setDocs([]);
    (async () => {
      try {
        if (!user) return;
        const records = await base44.entities.Patient.filter({ created_by_id: user.id });
        const patient = records[0];
        if (cancelled) return;
        setPatient(patient || null);
        if (patient) {
          const [a, v, rx, d] = await Promise.all([
            base44.entities.Appointment.filter({ patient_id: patient.id }),
            base44.entities.Visit.filter({ patient_id: patient.id, visible_to_patient: true }),
            base44.entities.Prescription.filter({ patient_id: patient.id, visible_to_patient: true }),
            base44.entities.MedicalDocument.filter({ patient_id: patient.id, visible_to_patient: true }),
          ]);
          if (!cancelled) { setAppts(a); setVisits(v); setPrescriptions(rx); setDocs(d); }
        }
      } catch { if (!cancelled) setLoadError(true); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [user, reload]);

  if (loadError) return <div role="alert" className="rounded-2xl border p-6 text-sm"><p>اطلاعات پرونده دریافت نشد. لطفاً دوباره تلاش کنید.</p><button onClick={() => setReload((value) => value + 1)} className="mt-4 text-primary underline">تلاش دوباره</button></div>;
  if (loading) return <div className="grid h-64 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /></div>;

  const upcoming = appts.filter((a) => isUpcomingAppointment(a)).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const past = appts.filter((a) => !isUpcomingAppointment(a)).sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  if (section === "appointments") return <ApptList appts={appts} t={t} lang={lang} tr={tr} />;
  if (section === "history") return <VisitList visits={visits} t={t} lang={lang} tr={tr} />;
  if (section === "prescriptions") return <RxList prescriptions={prescriptions} t={t} lang={lang} />;
  if (section === "documents") return <DocList docs={docs} t={t} lang={lang} />;
  if (section === "profile") return <Profile patient={patient} t={t} onSave={() => setReload((value) => value + 1)} />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t("dash.overview")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.welcome")}, {patient?.first_name || user?.full_name}</p>
        </div>
        <Link to="/appointment" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-soft"><Plus className="h-4 w-4" />{t("common.book")}</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarHeart} label={t("dash.nextAppt")} value={upcoming.length} color="primary" />
        <StatCard icon={Clock} label={t("dash.visits")} value={visits.length} color="secondary" delay={0.05} />
        <StatCard icon={FileText} label={t("dash.myPrescriptions")} value={prescriptions.length} color="accent" delay={0.1} />
        <StatCard icon={Pill} label={t("dash.myDocuments")} value={docs.length} color="success" delay={0.15} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-display font-bold">{t("dash.nextAppt")}</h3>
          {upcoming.length ? upcoming.slice(0, 3).map((a) => <ApptRow key={a.id} a={a} t={t} lang={lang} tr={tr} />) : <EmptyMini text={t("common.noData")} />}
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-display font-bold">{t("dash.prevAppts")}</h3>
          {past.length ? past.slice(0, 3).map((a) => <ApptRow key={a.id} a={a} t={t} lang={lang} tr={tr} />) : <EmptyMini text={t("common.noData")} />}
        </div>
      </div>
    </div>
  );
}

function ApptRow({ a, t, lang, tr }) {
  const statusColor = { confirmed: "bg-success/10 text-success", requested: "bg-warning/10 text-warning", cancelled: "bg-destructive/10 text-destructive", completed: "bg-primary/10 text-primary" };
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
      <div>
        <div className="font-semibold">{formatDate(a.date, lang)} · {a.time}</div>
        <div className="text-xs text-muted-foreground">{a.appointment_id}</div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[a.status] || ""}`}>{t(`common.${a.status}`)}</span>
    </div>
  );
}

function ApptList({ appts, t, lang, tr }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.myAppts")}</h1>
      <div className="space-y-3">
        {appts.length ? appts.map((a) => <ApptRow key={a.id} a={a} t={t} lang={lang} tr={tr} />) : <EmptyMini text={t("common.noData")} />}
      </div>
    </div>
  );
}

function VisitList({ visits, t, lang, tr }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.myHistory")}</h1>
      <div className="space-y-4">
        {visits.length ? visits.map((v) => (
          <div key={v.id} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="font-display font-semibold">{formatDate(v.visit_date, lang)}</div>
              <span className="text-xs text-muted-foreground">{v.visit_id}</span>
            </div>
            {v.diagnosis && <p className="mt-2 text-sm"><span className="text-muted-foreground">{t("dash.history")}:</span> {v.diagnosis}</p>}
            {v.treatment_plan && <p className="mt-1 text-sm"><span className="text-muted-foreground">{t("dash.history")}:</span> {v.treatment_plan}</p>}
          </div>
        )) : <EmptyMini text={t("common.noData")} />}
      </div>
    </div>
  );
}

function RxList({ prescriptions, t, lang }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.myPrescriptions")}</h1>
      <div className="space-y-3">
        {prescriptions.length ? prescriptions.map((rx) => (
          <div key={rx.id} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="font-display font-semibold">{formatDate(rx.prescribed_date, lang)}</div>
              <span className="font-mono text-xs text-primary" dir="ltr">{rx.prescription_id}</span>
            </div>
            {rx.diagnosis && <p className="mt-2 text-sm text-muted-foreground">{rx.diagnosis}</p>}
            {rx.notes && <p className="mt-1 text-sm">{rx.notes}</p>}
          </div>
        )) : <EmptyMini text={t("common.noData")} />}
      </div>
    </div>
  );
}

function DocList({ docs, t, lang }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.myDocuments")}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {docs.length ? docs.map((d) => (
          <a key={d.id} href={safeDocumentUrl(d.file_url)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition hover:border-primary/30">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{d.title}</div>
              <div className="text-xs text-muted-foreground">{formatDate(d.document_date, lang)}</div>
            </div>
          </a>
        )) : <EmptyMini text={t("common.noData")} />}
      </div>
    </div>
  );
}

function Profile({ patient, t, onSave }) {
  const [form, setForm] = useState(() => Object.fromEntries(['first_name', 'last_name', 'mobile', 'email', 'date_of_birth', 'national_id'].map((field) => [field, patient?.[field] || ''])));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const save = async () => {
    if (!patient || saving) return;
    if (!validPatientDetails(form)) { setSaveError('نام، نام خانوادگی و شماره همراه معتبر را وارد کنید.'); return; }
    setSaving(true);
    setSaveError("");
    try {
      const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
      if (!fields.date_of_birth) delete fields.date_of_birth;
      if (!fields.email) delete fields.email;
      await base44.entities.Patient.update(patient.id, fields);
      onSave();
    } catch { setSaveError('ذخیره اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.'); }
    finally { setSaving(false); }
  };
  if (!patient) return <Empty title={t("dash.myProfile")} t={t} />;
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dash.myProfile")}</h1>
      <div className="max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          {[{ k: "first_name", l: t("auth.firstName") }, { k: "last_name", l: t("auth.lastName") }, { k: "mobile", l: t("auth.mobile") }, { k: "email", l: t("auth.email") }, { k: "date_of_birth", l: "تاریخ تولد", type: "date" }, { k: "national_id", l: "کد ملی" }].map((f) => (
            <div key={f.k}>
              <label htmlFor={`profile-${f.k}`} className="mb-1.5 block text-sm font-medium">{f.l}</label>
              <input id={`profile-${f.k}`} maxLength={120} type={f.type || (f.k === "email" ? "email" : f.k === "mobile" ? "tel" : "text")} value={form[f.k] || ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
        </div>
        {saveError && <p role="alert" className="mt-4 text-sm text-destructive">{saveError}</p>}
        <button onClick={save} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-soft disabled:opacity-60">{t("common.save")}</button>
      </div>
    </div>
  );
}

function Empty({ title, t }) {
  return <div><h1 className="mb-6 font-display text-2xl font-bold">{title}</h1><EmptyMini text={t("common.noData")} /></div>;
}
function EmptyMini({ text }) {
  return <div className="grid place-items-center rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">{text}</div>;
}
function safeDocumentUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch { return undefined; }
}
