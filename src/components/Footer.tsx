"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

const navItems = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
] as const;

export function Footer() {
  const t = useTranslations();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-light dark:border-border-dark">
      <div className="max-w-container mx-auto px-6 py-6 flex items-center justify-between text-sm">
        <span className="text-muted-light dark:text-muted-dark">
          {t("footer.copyright", { year })}
        </span>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white"
                }`}
              >
                {t(`nav.${item.label}`)}
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
