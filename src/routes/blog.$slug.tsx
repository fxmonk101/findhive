import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ProductDescription } from "@/components/product/ProductDescription";
import { POSTS, getPost } from "@/lib/blog";
import { abs, articleLd, breadcrumbLd, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable | findhive" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const path = `/blog/${params.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: abs(path) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: abs(path) }],
      scripts: [
        ldScript(
          articleLd({
            title: post.title,
            description: post.metaDescription,
            path,
            date: post.date,
            author: post.author,
          }),
        ),
        ldScript(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/blog" },
            { name: post.title, path },
          ]),
        ),
      ],
    };
  },
  component: Article,
});

function Article() {
  const { post } = Route.useLoaderData();
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <header className="navy-mesh text-navy-foreground">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-navy-foreground/60">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-accent">Guides</Link>
          </nav>
          <span className="eyebrow mt-4 block text-accent">{post.category}</span>
          <h1 className="mt-2 animate-rise font-display text-3xl font-black text-navy-foreground md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 h-0.5 w-20 animate-wipe gold-rule" />
          <p className="mt-4 text-[13px] text-navy-foreground/65">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ·{" "}
            {post.readMinutes} min read · {post.author}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12">
        <ProductDescription content={post.body} />
      </div>

      <section className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-[1400px] px-4">
          <h2 className="mb-6 text-xl font-bold md:text-2xl">Keep reading</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="eyebrow text-accent">{p.category}</span>
                <h3 className="mt-2 font-display text-base font-bold leading-snug transition group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
