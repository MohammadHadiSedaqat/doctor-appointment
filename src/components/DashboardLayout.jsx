import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, LogOut, Menu, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/lib/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function DashboardLayout({ navItems, active, onNavigate, children }) {
  const { t, dir } = useI18n();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null));
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white"><Stethoscope className="h-5 w-5" /></div>
        <span className="font-display font-bold">{t("hero.title")}</span>
      </Link>
      <nav aria-label={t("nav.dashboard")} className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button key={item.key} aria-current={isActive ? "page" : undefined} onClick={() => { onNavigate(item.key); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"}`}>
              <item.icon className="h-4 w-4 shrink-0" />{item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button onClick={() => logout()} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/5">
          <LogOut className="h-4 w-4" />{t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 hidden w-64 border-e border-border bg-white lg:block">
        <NavContent />
      </aside>

      <dialog ref={dialogRef} onCancel={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }} aria-label={t("nav.dashboard")} className={`fixed inset-y-0 m-0 h-dvh max-h-none w-72 max-w-[90vw] border-0 bg-white p-0 text-foreground backdrop:bg-black/30 ${dir === 'rtl' ? 'ms-auto' : 'me-auto'}`}>
        <div className="flex h-full flex-col">
          <button onClick={() => setOpen(false)} aria-label={t("common.close")} className="absolute end-2 top-2 rounded-lg p-2"><X className="h-4 w-4" /></button>
          <NavContent />
        </div>
      </dialog>

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-white/80 px-4 backdrop-blur sm:px-6">
          <button aria-label={t("nav.dashboard")} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="hidden text-sm text-muted-foreground sm:block">{t("auth.welcome")}, <span className="font-semibold text-foreground">{user?.full_name || user?.email}</span></div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}