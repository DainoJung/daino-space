import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getPostBySlug, getPostBlocks, getBlogPosts } from "@/lib/notion";
import { NotionRenderer } from "@/components/NotionRenderer";
import { Newsletter } from "@/components/Newsletter";

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("blog");

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [blocks, allPosts] = await Promise.all([
    getPostBlocks(post.id),
    getBlogPosts(),
  ]);

  const morePosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="space-y-16">
      <article className="space-y-10">
        {/* Breadcrumb + Date */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-light dark:text-muted-dark">
              <Link
                href="/blog"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                {t("allPosts")}
              </Link>
              <span>|</span>
              <span className="text-accent line-clamp-1 max-w-[300px]">
                {post.title}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark shrink-0">
              <span>🗓️</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-[15px] leading-[1.8]">
              {post.description}
            </p>
          )}
        </section>

        {/* Content */}
        <NotionRenderer blocks={blocks} />
      </article>

      {/* More Posts */}
      {morePosts.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">More Posts</h2>
            <div className="border-b border-border-light dark:border-border-dark" />
          </div>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {morePosts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="flex items-baseline gap-6 py-4 group"
              >
                <span className="text-sm text-muted-light dark:text-muted-dark shrink-0 w-20">
                  {new Date(p.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-sm group-hover:text-accent transition-colors">
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
