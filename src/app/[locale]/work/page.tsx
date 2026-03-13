import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Newsletter } from "@/components/Newsletter";
import { getProjects } from "@/lib/projects";

export const revalidate = 60;

export default async function WorkPage() {
  const t = await getTranslations("work");
  const projects = await getProjects();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tight leading-none">
          {t("title")}
        </h1>
        <p className="text-[15px] leading-[1.8]">
          {t("description1")}
          <em>{t("description1_italic1")}</em>
          {t("description1_mid")}
          <em>{t("description1_italic2")}</em>
        </p>
      </section>

      {/* All Projects */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">{t("allProjects")}</h2>
          <div className="border-b border-border-light dark:border-border-dark" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a] mb-4 relative">
                <div className="absolute top-3 left-3 text-xs font-mono text-white/60">
                  {project.year}
                </div>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Outro */}
      <section className="space-y-4 text-[15px] leading-[1.8]">
        <p>{t("outroStart")}</p>
        <p>
          {t("outroEnd")}
          <a
            href="mailto:wjdekdls3693@gmail.com"
            className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
          >
            {t("getInTouch")}
          </a>
          {t("outroEnd2")}
        </p>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
