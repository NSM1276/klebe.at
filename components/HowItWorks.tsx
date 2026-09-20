"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.howItWorks.title}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {t.howItWorks.steps.map((step, index) => (
          <div key={step.title} className="bg-panel rounded-lg p-6">
            <span className="text-accent text-sm font-semibold">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-white font-semibold mt-2">{step.title}</h3>
            <p className="text-white/70 text-sm mt-1">{step.text}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
