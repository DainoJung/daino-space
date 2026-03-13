"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ko" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-mono font-medium text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
      aria-label="Toggle language"
    >
      {locale === "en" ? "KO" : "EN"}
    </button>
  );
}
