import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProjectBySlug, getProjectBlocks, getNextProject } from "@/lib/projects";
import { NotionRenderer } from "@/components/NotionRenderer";
import { Newsletter } from "@/components/Newsletter";

export const revalidate = 60;

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("work");

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [blocks, nextProject] = await Promise.all([
    getProjectBlocks(project.id),
    getNextProject(slug),
  ]);

  return (
    <div className="space-y-16">
      {/* Breadcrumb + Date */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-light dark:text-muted-dark">
            <Link
              href="/work"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              {t("allProjects")}
            </Link>
            <span>|</span>
            <span className="text-accent">{project.title}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark">
            <span>🗓️</span>
            <span>{project.year}</span>
          </div>
        </div>

        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tight leading-none">
          {project.title}
        </h1>

        <p className="text-[15px] leading-[1.8]">
          {project.description}
        </p>
      </section>

      {/* Hero Image */}
      <section>
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#f0e6ff] dark:bg-surface-dark border border-border-light dark:border-border-dark">
          <div className="w-full h-full flex items-center justify-center text-muted-light dark:text-muted-dark">
            <span className="text-sm font-mono">{project.title}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <NotionRenderer blocks={blocks} />

      {/* Next Project */}
      {nextProject && (
        <section className="flex justify-end">
          <Link
            href={`/work/${nextProject.slug}`}
            className="text-sm text-muted-light dark:text-muted-dark hover:text-accent transition-colors"
          >
            {nextProject.title} ›
          </Link>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
