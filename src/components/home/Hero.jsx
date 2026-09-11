import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarHeart, Calculator, Stethoscope, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import DoctorPortrait from "@/components/DoctorPortrait";
import { useI18n } from "@/i18n/I18nContext";

export default function Hero() {
  const { t, dir } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* animated background */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 start-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div className="absolute top-40 end-[-5%] h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 start-1/3 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-float-slow" />
        {/* ECG line */}
        {!reduce && (
          <svg className="absolute bottom-24 inset-x-0 w-full h-24 opacity-[0.07]" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 L200,50 L220,20 L240,80 L260,30 L280,70 L300,50 L500,50 L520,15 L540,85 L560,50 L800,50 L820,25 L840,75 L860,50 L1200,50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="1000" className="animate-[ecg_4s_linear_infinite]" />
          </svg>
        )}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" />
              {t("hero.badge")}
            </motion.div>

            <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-5 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </motion.h1>
            <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-3 text-lg font-semibold text-secondary">
              {t("hero.specialty")}
            </motion.p>
            <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("hero.intro")}
            </motion.p>

            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/appointment" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3.5 font-semibold text-white shadow-soft transition hover:shadow-glow hover:scale-[1.02]">
                <CalendarHeart className="h-5 w-5" />
                {t("hero.book")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 font-semibold text-foreground transition hover:border-primary/40 hover:shadow-soft">
                <Calculator className="h-5 w-5 text-primary" />
                {t("hero.calc")}
              </Link>
            </motion.div>
          </motion.div>

          {/* doctor portrait with animated frame */}
          <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5]">
              {/* rotating rings */}
              <div className="absolute inset-0 -m-6 rounded-[3rem] border border-primary/10 animate-spin-slow" />
              <div className="absolute inset-0 -m-3 rounded-[2.5rem] border-2 border-dashed border-accent/20 animate-spin-slow" style={{ animationDirection: "reverse" }} />
              {/* glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              {/* portrait */}
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-4 border-white shadow-card">
                <DoctorPortrait />
              </div>
              {/* floating particles */}
              {!reduce && [Stethoscope, Activity, ShieldCheck].map((Icon, i) => (
                <motion.div key={i} className="absolute grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-card text-primary" style={{ top: `${20 + i * 25}%`, [dir === "rtl" ? "left" : "right"]: i % 2 ? "-8%" : "auto", [dir === "rtl" ? "right" : "left"]: i % 2 ? "auto" : "-8%" }} animate={{ y: [0, -14, 0] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}>
                  <Icon className="h-5 w-5" />
                </motion.div>
              ))}
              {/* info card */}
              <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="absolute bottom-6 start-6 end-6 rounded-2xl glass border border-white/40 p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t("hero.careCard")}</div>
                    <div className="text-xs text-muted-foreground">{t("hero.bookCard")}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}