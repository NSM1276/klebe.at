"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
        {t.hero.title}
      </h1>
      <p className="mt-6 text-lg text-white/70 max-w-xl">{t.hero.subtitle}</p>
      <a
        href="#order"
        className="mt-8 inline-block bg-accent text-black font-semibold px-6 py-3 rounded-md"
      >
        {t.hero.cta}
      </a>
    </section>
  );
}
