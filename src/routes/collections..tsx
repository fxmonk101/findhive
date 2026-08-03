import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollection, listCollection } from "@/lib/collections";
import { abs, breadcrumbLd, collectionPageLd, ldScript } from "@/lib/seo";

const opts = (slug: string) =>
  queryOptions({ queryKey: ["collection", slug], queryFn: () => listCollection(slug) });

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params, context }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    const products = await context.queryClient.ensureQueryData(opts(params.slug));
    return { collection, products };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection unavailable | findhive" }, { name: "robots", content: "noindex" }] };
    }
    const { collection, products } = loaderData;
    const path = `/collections/${params.slug}`;
    return {
      meta: [
        { title: `${collection.name} | findhive` },
        { name: "description", content: collection.intro.slice(0, 155) },
        { property: "og:title", content: `${collection.name} | findhive` },
        { property: "og:description", content: collection.intro.slice(0, 155) },
        { property: "og:type", content: "website" },
        { property: "og:url", content: abs(path) },
        { name: "twitter:card", content: "summary_large_image" },
        ...(products[0]?.image_url?.startsWith("http")
          ? [
              { property: "og:image", content: products[0].image_url },
              { name: "twitter:image", content: products[0].image_url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: abs(path) }],
      scripts: [
        ldScript(
          collectionPageLd({ name: collection.name, description: collection.intro, path, items: products }),
        ),
        ldScript(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/shop" },
            { name: collection.name, path },
          ]),
        ),
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const { collection } = Route.useLoaderData();
  const q = useQuery(opts(slug));

  return (
    <div>
      <section className="navy-mesh text-navy-foreground">
        <div className="mx-auto max-w-[1400px] px-4 py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-navy-foreground/60">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-navy-foreground">{collection.short}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl animate-rise font-display text-3xl font-black text-navy-foreground md:text-5xl">
            {collection.headline}
          </h1>
          <div className="mt-4 h-0.5 w-24 animate-wipe gold-rule" />
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-navy-foreground/75">{collection.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12">
        <h2 className="mb-6 text-xl font-bold md:text-2xl">
          {collection.name}
          {q.data?.length ? <span className="ml-2 text-sm font-medium text-muted-foreground">({q.data.length} in stock)</span> : null}
        </h2>
        <ProductGrid products={q.data ?? []} loading={q.isLoading} empty="Nothing in this collection right now — check back soon." />
      </section>
    </div>
  );
}
