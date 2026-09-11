import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nContext";

export default function StatCounter({ value, suffix = "", duration = 2000, className = "" }) {
  const { lang } = useI18n();
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const target = Number.isFinite(Number(value)) ? Number(value) : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined' || duration <= 0) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setDisplay(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
        if (progress < 1) frame = requestAnimationFrame(animate);
        else setDisplay(target);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat(lang === "fa" ? "fa-IR" : lang === "ar" ? "ar-EG" : "en-US").format(display);

  return (
    <span ref={ref} className={className}>
      {formatted}{suffix}
    </span>
  );
}