"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex rounded-md border border-white/20 bg-panel/80 backdrop-blur text-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setLocale("de")}
        aria-pressed={locale === "de"}
        className={`px-3 py-1.5 ${locale === "de" ? "bg-accent text-black" : "text-white/70"}`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`px-3 py-1.5 ${locale === "en" ? "bg-accent text-black" : "text-white/70"}`}
      >
        EN
      </button>
    </div>
  );
}
