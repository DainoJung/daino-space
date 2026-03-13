"use client";

import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section className="flex flex-col sm:flex-row gap-5 items-center rounded-xl bg-surface-light dark:bg-surface-dark p-5 sm:p-6">
      <div className="w-full sm:w-1/4 aspect-square rounded-lg overflow-hidden bg-border-light dark:bg-border-dark">
        <img
          src="/newsletter.jpg"
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <div className="space-y-3 w-3/4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder={t("placeholder")}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
            >
              {t("subscribe")}
            </button>
          </form>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            {t("description")}{" "}
            <em>{t("disclaimer")}</em>
          </p>
        </div>
      </div>
    </section>
  );
}
