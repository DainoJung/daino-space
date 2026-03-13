import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/notion";
import { Newsletter } from "@/components/Newsletter";
import { OptionalImage } from "@/components/OptionalImage";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogContent posts={posts} />;
}

function BlogContent({
  posts,
}: {
  posts: Awaited<ReturnType<typeof getBlogPosts>>;
}) {
  const t = useTranslations("blog");

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tight leading-none">
          {t("title")}
        </h1>
        <div className="space-y-4 text-[15px] leading-[1.8]">
          <p>{t("description1")}</p>
          <p>{t("description2")}</p>
        </div>
      </section>

      {/* Hero Image */}
      <section>
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
          <OptionalImage
            src="/blog-hero.jpg"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* All Posts */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3">{t("allPosts")}</h2>
          <div className="border-b border-border-light dark:border-border-dark" />
        </div>
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
            {t("noPosts")}
          </p>
        )}
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
