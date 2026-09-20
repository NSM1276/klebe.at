"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

const PLACEHOLDER_IMAGES = ["/gallery/example-1.jpg", "/gallery/example-2.jpg", "/gallery/example-3.jpg"];

export function Gallery() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.gallery.title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_IMAGES.map((src) => (
          <div key={src} className="aspect-square bg-panel rounded-lg overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
