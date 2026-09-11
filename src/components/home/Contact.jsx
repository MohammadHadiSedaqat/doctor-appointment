import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";
import { base44 } from "@/api/base44Client";
import { site, getClinicAddress, getClinicPhoneHref } from "@/config/site";
import { formatDigits } from "@/lib/format";
import WorkingHours from "@/components/WorkingHours";
import { useAuth } from "@/lib/AuthContext";

const copy = {
  fa: { sent: "پیام شما با موفقیت ارسال شد.", failed: "ارسال پیام ممکن نشد. لطفاً بعداً دوباره تلاش کنید.", unavailable: "فرم تماس موقتاً در دسترس نیست؛ برای هماهنگی با کلینیک تماس بگیرید.", name: "نام و نام خانوادگی", phone: "شماره موبایل", email: "ایمیل (اختیاری)", message: "پیام شما (لطفاً فایل یا اطلاعات پزشکی ارسال نکنید)", submit: "ارسال پیام" },
  en: { sent: "Your message was sent successfully.", failed: "We could not send your message. Please try again later.", unavailable: "The contact form is temporarily unavailable; please call the clinic to arrange your visit.", name: "Full name", phone: "Mobile number", email: "Email (optional)", message: "Your message (please do not send medical files or records)", submit: "Send message" },
  ar: { sent: "تم إرسال رسالتك بنجاح.", failed: "تعذر إرسال الرسالة. يرجى المحاولة لاحقًا.", unavailable: "نموذج الاتصال غير متاح مؤقتًا؛ يرجى الاتصال بالعيادة لتنسيق زيارتك.", name: "الاسم الكامل", phone: "رقم الجوال", email: "البريد الإلكتروني (اختياري)", message: "رسالتك (يرجى عدم إرسال ملفات أو معلومات طبية)", submit: "إرسال الرسالة" },
};

export default function Contact({ showHeading = true }) {
  const { t, lang } = useI18n();
  const { appPublicSettings, isLoadingPublicSettings, authError } = useAuth();
  const text = copy[lang] || copy.en;
  const privacyLabel = { fa: "حریم خصوصی و استفاده از سایت", en: "Privacy and Website Use", ar: "الخصوصية واستخدام الموقع" }[lang] || "Privacy and Website Use";
  const missingContact = { fa: "اطلاعات تماس پس از تأیید کلینیک درج می‌شود.", en: "Contact details will be added after clinic verification.", ar: "ستُضاف بيانات الاتصال بعد التحقق من العيادة." }[lang] || "Contact details will be added after clinic verification.";
  const backendUnavailable = isLoadingPublicSettings || !appPublicSettings || ["not_deployed", "unknown"].includes(authError?.type);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const address = getClinicAddress(lang);
  const contacts = [
    site.phone && { icon: Phone, label: t("footer.contact"), value: formatDigits(site.phone, lang), href: getClinicPhoneHref() },
    site.email && { icon: Mail, label: t("auth.email"), value: site.email, href: `mailto:${site.email}` },
    address && { icon: MapPin, label: t("footer.address"), value: address },
  ].filter(Boolean);

  const submit = async (event) => {
    event.preventDefault();
    if (loading || backendUnavailable || !base44?.entities?.ContactMessage?.create) { setStatus("error"); return; }
    const payload = { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), message: form.message.trim() };
    if (!payload.name || !payload.phone || !payload.message) { setStatus("error"); return; }
    setLoading(true); setStatus(null);
    try {
      await base44.entities.ContactMessage.create(payload);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    } finally { setLoading(false); }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        {showHeading && <AnimatedSection className="mx-auto max-w-2xl text-center"><h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sections.contactTitle")}</h2><p className="mt-3 text-muted-foreground">{t("sections.contactSub")}</p></AnimatedSection>}
        <div className={`${showHeading ? "mt-12" : "mt-2"} grid gap-6 lg:grid-cols-5`}>
          <AnimatedSection className="space-y-4 lg:col-span-2">
            {contacts.length ? contacts.map(({ icon: Icon, label, value, href }) => <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft"><div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><div><div className="text-sm text-muted-foreground">{label}</div>{href ? <a href={href} dir="ltr" className="font-display font-semibold hover:text-primary">{value}</a> : <div className="font-display font-semibold">{value}</div>}</div></div>) : <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">{missingContact}</div>}
            <WorkingHours className="rounded-2xl border border-border bg-white p-5 shadow-soft" />
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <form onSubmit={submit} className="rounded-3xl border border-border bg-white p-6 shadow-soft sm:p-8" noValidate={false}>
              {status === "success" ? <div className="flex flex-col items-center justify-center gap-3 py-12 text-center" role="status"><CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" /><p className="font-display text-lg font-semibold">{text.sent}</p></div> : <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">{text.name}</label><input id="contact-name" required maxLength={120} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
                <div><label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium">{text.phone}</label><input id="contact-phone" required maxLength={32} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
                <div className="sm:col-span-2"><label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">{text.email}</label><input id="contact-email" maxLength={160} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
                <div className="sm:col-span-2"><label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">{text.message}</label><textarea id="contact-message" required maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
                {backendUnavailable && <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2" role="status"><AlertCircle className="h-4 w-4" aria-hidden="true" />{text.unavailable}</div>}
                {status === "error" && !backendUnavailable && <div className="flex items-center gap-2 text-sm text-destructive sm:col-span-2" role="alert"><AlertCircle className="h-4 w-4" aria-hidden="true" />{text.failed}</div>}
                <Link to="/privacy" className="text-sm text-primary underline underline-offset-4 sm:col-span-2">{privacyLabel}</Link>
                <button type="submit" disabled={loading || backendUnavailable} title={backendUnavailable ? text.unavailable : undefined} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-soft transition hover:shadow-glow disabled:opacity-60 sm:col-span-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}{text.submit}</button>
              </div>}
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
