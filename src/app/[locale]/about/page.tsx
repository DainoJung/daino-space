import { useTranslations } from "next-intl";
import { Newsletter } from "@/components/Newsletter";
import { OptionalImage } from "@/components/OptionalImage";
import { FadeIn } from "@/components/FadeIn";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="space-y-16">
      {/* Hero */}
      <FadeIn>
        <section className="space-y-6">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tight leading-none">
            {t("title")}
          </h1>
          <p className="text-sm font-semibold">
            {t("subtitle")}
          </p>
          <p className="text-[15px] leading-[1.8]">
            {t("intro")}
          </p>
        </section>
      </FadeIn>

      {/* Photo */}
      <FadeIn delay={100}>
        <section>
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <OptionalImage
              src="/about-photo.jpg"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      </FadeIn>

      {/* Newsletter */}
      <FadeIn delay={200}>
        <Newsletter />
      </FadeIn>
    </div>
  );
}
