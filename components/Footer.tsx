"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="px-6 py-12 border-t border-white/10 text-center text-white/60 text-sm">
      <p>{t.footer.contactTitle}: +43 660 0000000 · Telegram @klebe_at</p>
      <p className="mt-2">klebe.at</p>
    </footer>
  );
}
