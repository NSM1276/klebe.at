"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

export function DeliveryZone() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.deliveryZone.title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-panel rounded-lg p-6 text-white/80">{t.deliveryZone.vienna}</div>
        <div className="bg-panel rounded-lg p-6 text-white/80">{t.deliveryZone.other}</div>
      </div>
    </AnimatedSection>
  );
}
