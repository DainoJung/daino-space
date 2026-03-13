import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/notion";
import { getProjects } from "@/lib/projects";
import { Newsletter } from "@/components/Newsletter";
import type { BlogPost } from "@/lib/notion";
import type { Project } from "@/lib/projects";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getBlogPosts(),
    getProjects(),
  ]);

  return (
    <HomeContent posts={posts.slice(0, 3)} projects={projects.slice(0, 3)} />
  );
}

function HomeContent({
  posts,
  projects,
}: {
  posts: BlogPost[];
  projects: Project[];
}) {
  const t = useTranslations("home");

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8 space-y-10">
        <div>
          <h1 className="text-[clamp(3rem,8vw,5rem)] font-black tracking-tight leading-none mb-4">
            {t("name")}
          </h1>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{t("role")}</span>
            <span>
              <span className="mr-1">📍</span>
              {t("location")}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-[15px] leading-[1.8]">
          <p>{t("bio1")}</p>
          <p>
            {t("bio2_prefix")}
            <strong>{t("bio2_bold")}</strong>
            {t("bio2_suffix")}
          </p>
          <p>{t("bio3")}</p>
        </div>
      </section>

      {/* Latest Projects */}
      <section>
        <SectionHeader title={t("latestProjects")}>
          <Link
            href="/work"
            className="text-sm text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
          >
            {t("viewAll")}
          </Link>
        </SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              year={project.year}
              href={`/work/${project.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <SectionHeader title={t("latestPosts")}>
          <Link
            href="/blog"
            className="text-sm text-muted-light dark:text-muted-dark hover:text-black dark:hover:text-white transition-colors"
          >
            {t("viewAll")}
          </Link>
        </SectionHeader>
        {posts.length > 0 ? (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-baseline gap-6 py-4 group"
              >
                <span className="text-sm text-muted-light dark:text-muted-dark shrink-0 w-20">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-sm group-hover:text-accent transition-colors">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-light dark:text-muted-dark py-4">
            Coming soon...
          </p>
        )}
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        {children}
      </div>
      <div className="border-b border-border-light dark:border-border-dark" />
    </div>
  );
}

function ProjectCard({
  title,
  description,
  year,
  href,
}: {
  title: string;
  description: string;
  year: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a] mb-4 relative">
        <div className="absolute top-3 left-3 text-xs font-mono text-white/60">
          {year}
        </div>
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
