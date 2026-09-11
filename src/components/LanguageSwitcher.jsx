import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, languages, dir } = useI18n();
  const current = languages[lang] || languages.fa || Object.values(languages)[0];
  const label = { fa: "انتخاب زبان", en: "Choose language", ar: "اختيار اللغة" }[lang] || "Choose language";

  return (
    <DropdownMenu.Root dir={dir}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${current.name}`}
          className="flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:shadow-soft"
        >
          <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
          {!compact && <span className="hidden sm:inline"><span aria-hidden="true">{current.flag} </span>{current.name}</span>}
          {compact && <span aria-hidden="true">{current.flag}</span>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          aria-label={label}
          className="z-50 w-44 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
        >
          <DropdownMenu.RadioGroup value={lang} onValueChange={setLang}>
            {Object.values(languages).map((language) => (
              <DropdownMenu.RadioItem
                key={language.code}
                value={language.code}
                textValue={language.name}
                className={`flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none transition data-[highlighted]:bg-muted data-[highlighted]:ring-2 data-[highlighted]:ring-inset data-[highlighted]:ring-primary/30 ${lang === language.code ? "bg-primary/10 font-semibold text-primary" : "text-foreground"}`}
              >
                <span className="flex items-center gap-2" lang={language.code}>
                  <span className="text-base" aria-hidden="true">{language.flag}</span>
                  {language.name}
                </span>
                <DropdownMenu.ItemIndicator><Check className="h-4 w-4" aria-hidden="true" /></DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
