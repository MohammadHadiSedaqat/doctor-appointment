import React, { useState } from "react";
import { Bone, Stethoscope } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import { site } from "@/config/site";

export default function DoctorPortrait({ className = "", alt = "" }) {
  const { lang } = useI18n();
  const [failed, setFailed] = useState(false);
  const label = alt || ({ fa: "تصویر معرفی دکتر فاضل صداقت در دسترس نیست", en: "Portrait of Dr. Fazel Sedaghat is not available", ar: "صورة د. فاضل صداقت غير متاحة" }[lang] || "Doctor portrait unavailable");
  if (site.portraitUrl && !failed) return <img src={site.portraitUrl} alt={alt || site.name[lang] || site.name.en} width="800" height="1000" decoding="async" onError={() => setFailed(true)} className={`aspect-[4/5] min-w-0 h-full w-full object-cover ${className}`} />;
  return <div role="img" aria-label={label} className={`aspect-[4/5] min-w-0 grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 ${className}`}><div className="relative grid h-40 w-40 place-items-center rounded-full border border-primary/20 bg-white/70 text-primary shadow-soft"><Bone className="absolute -start-10 top-5 h-10 w-10 rotate-45 text-secondary/60" aria-hidden="true" /><Stethoscope className="h-20 w-20" aria-hidden="true" /><div className="absolute -bottom-8 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold text-foreground shadow-soft">{site.specialty[lang] || site.specialty.en}</div></div></div>;
}
