import React from "react";
import { Outlet } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import { useI18n } from "@/i18n/I18nContext";

export default function PublicLayout() {
  const { lang } = useI18n();
  const skipLabel = { fa: "پرش به محتوای اصلی", en: "Skip to main content", ar: "الانتقال إلى المحتوى الرئيسي" }[lang] || "Skip to main content";
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-card"
      >
        {skipLabel}
      </a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="pt-16">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
