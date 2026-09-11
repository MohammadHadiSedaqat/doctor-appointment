import React, { useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";
import AnimatedSection from "@/components/AnimatedSection";

export default function Gallery({ images }) {
  const { t, tr, lang, dir } = useI18n();
  const [lightbox, setLightbox] = useState(null);
  const triggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const headingId = useId();
  const list = (images || []).filter((img) => img?.image_url).slice(0, 8);
  if (!list.length) return null;
  const next = () => setLightbox((index) => (index + 1) % list.length);
  const prev = () => setLightbox((index) => (index - 1 + list.length) % list.length);
  const caption = (image) => tr(image, "caption") || image.alt || t("sections.galleryTitle");
  const labels = {
    fa: { previous: "تصویر قبلی", next: "تصویر بعدی", view: "نمایش تصویر" },
    en: { previous: "Previous image", next: "Next image", view: "View image" },
    ar: { previous: "الصورة السابقة", next: "الصورة التالية", view: "عرض الصورة" },
  }[lang] || { previous: "Previous image", next: "Next image", view: "View image" };
  const selectedImage = lightbox !== null ? list[lightbox] : null;

  return (
    <section className="py-20" aria-labelledby={headingId}>
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 id={headingId} className="font-display text-3xl font-bold sm:text-4xl">{t("sections.galleryTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("sections.gallerySub")}</p>
        </AnimatedSection>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((image, index) => (
            <AnimatedSection key={image.id || index} delay={index * 0.04}>
              <button
                type="button"
                onClick={(event) => { triggerRef.current = event.currentTarget; setLightbox(index); }}
                aria-label={`${labels.view}: ${caption(image)}`}
                aria-haspopup="dialog"
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-soft"
              >
                <img src={image.image_url} alt={caption(image)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-start text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">{tr(image, "caption")}</div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <Dialog.Root open={Boolean(selectedImage)} onOpenChange={(open) => { if (!open) setLightbox(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
          <Dialog.Content
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}
            onClick={(event) => { if (event.target === event.currentTarget) setLightbox(null); }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const forward = dir === "rtl" ? event.key === "ArrowLeft" : event.key === "ArrowRight";
              if (forward) next(); else prev();
            }}
            className="fixed inset-0 z-50 grid place-items-center p-4 outline-none"
          >
            <Dialog.Title className="sr-only">{selectedImage ? caption(selectedImage) : t("sections.galleryTitle")}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label={t("common.close")} className="absolute end-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" aria-hidden="true" /></button>
            </Dialog.Close>
            {list.length > 1 && <>
              <button type="button" aria-label={labels.previous} onClick={prev} className="absolute start-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" /></button>
              <button type="button" aria-label={labels.next} onClick={next} className="absolute end-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" /></button>
            </>}
            {selectedImage && <img src={selectedImage.image_url} alt={caption(selectedImage)} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
