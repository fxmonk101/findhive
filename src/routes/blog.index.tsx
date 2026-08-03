import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/lib/blog";
import { abs, breadcrumbLd, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Guides, News & Release Updates | findhive" },
      { name: "description", content: "Pokémon TCG release updates, grading and storage guides, watch buying advice and fitness equipment explainers from the findhive team." },
      { property: "og:title", content: "Guides, News & Release Updates | findhive" },
      { property: "og:description", content: "Collecting guides, release calendars and buying advice from findhive." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/blog") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/blog") }],
    scripts: [ldScript(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }]))],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [lead, ...rest] = POSTS;
  return (
    <div>
      <section className="navy-mesh text-navy-foreground">
        <div className="mx-auto max-w-[1400px] px-4 py-14">
          <span className="eyebrow text-accent">findhive journal</span>
          <h1 className="mt-3 max-w-3xl animate-rise font-display text-3xl font-black text-navy-foreground md:text-5xl">
            Guides, release updates and collecting advice
          </h1>
          <div className="mt-4 h-0.5 w-24 animate-wipe gold-rule" />
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-navy-foreground/75">
            Practical, no-hype writing on Pokémon TCG sets, grading, authentication, watches and home training gear —
            written by the people who inspect and pack the stock.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <Link
          to="/blog/$slug"
          params={{ slug: lead.slug }}
          className="group grid gap-6 overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition hover:shadow-lift md:grid-cols-[1.4fr_1fr] md:p-9"
        >
          <div>
            <span className="eyebrow text-accent">{lead.category}</span>
            <h2 className="mt-2 font-display text-2xl font-black leading-tight transition group-hover:text-accent md:text-3xl">
              {lead.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{lead.excerpt}</p>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">
              {new Date(lead.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ·{" "}
              {lead.readMinutes} min read
            </p>
          </div>
          <div className="hidden items-center justify-center rounded-2xl bg-surface md:flex">
            <span className="font-display text-6xl font-black text-accent/25">01</span>
          </div>
        </Link>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="eyebrow text-accent">{p.category}</span>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug transition group-hover:text-accent">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <p className="mt-auto pt-4 text-xs font-semibold text-muted-foreground">
                {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                {p.readMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
