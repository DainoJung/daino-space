"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LanguageToggle } from "./LanguageToggle";

const navItems = [
  { href: "/about", label: "about" },
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md">
      <div className="max-w-container mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-bold text-base tracking-tight hover:opacity-70 transition-opacity"
          >
            Daino
          </Link>

          <span className="text-border-light dark:text-border-dark select-none">|</span>

          <nav className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white"
                  }`}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Social icons + Language */}
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/wjdekdls3693"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
            aria-label="X (Twitter)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/daino-jung"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="mailto:wjdekdls3693@gmail.com"
            className="text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
            aria-label="Email"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
