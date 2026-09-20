"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { AnimatedSection } from "@/components/AnimatedSection";

const SIZES = ["25x25", "30x30", "35x35"];
const PRICES: Record<string, Record<string, string>> = {
  basic: { "25x25": "25€", "30x30": "30€", "35x35": "35€" },
  standard: { "25x25": "30€", "30x30": "35€", "35x35": "40€" },
  premium: { "25x25": "40€", "30x30": "45€", "35x35": "50€" },
};

export function Pricing() {
  const { t } = useLanguage();

  return (
    <AnimatedSection className="px-6 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">{t.pricing.title}</h2>
      <table className="w-full text-left text-white/80 text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="py-2">{t.pricing.qualityLabel}</th>
            {SIZES.map((size) => (
              <th key={size} className="py-2">{size} cm</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Object.keys(PRICES) as Array<keyof typeof t.pricing.quality>).map((quality) => (
            <tr key={quality} className="border-b border-white/10">
              <td className="py-2">{t.pricing.quality[quality]}</td>
              {SIZES.map((size) => (
                <td key={size} className="py-2">{PRICES[quality][size]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </AnimatedSection>
  );
}
