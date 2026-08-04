import { createFileRoute } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CATEGORIES } from "@/lib/categories";
import { getFeatured, listByCategory } from "@/lib/products";

const featuredOpts = queryOptions({ queryKey: ["featured"], queryFn: () => getFeatured(8) });
const catOpts = (slug: string) =>
  queryOptions({ queryKey: ["home-cat", slug], queryFn: () => listByCategory(slug) });

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(featuredOpts);
    CATEGORIES.forEach((c) => context.queryClient.ensureQueryData(catOpts(c.slug)));
  },
  component: Index,
});

function Index() {
  const featured = useQuery(featuredOpts);
  return (
    <>
      <Hero />
      <CategoryStrip />
      <section className="border-b border-border py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary md:text-2xl">Trending Now</h2>
              <p className="text-sm text-muted-foreground">Restocked this week — ready to ship from our warehouse</p>
            </div>
          </div>
          <ProductGrid products={featured.data ?? []} loading={featured.isLoading} />
        </div>
      </section>
      {CATEGORIES.map((c, i) => (
        <CategoryShowcaseWrapper key={c.slug} slug={c.slug} index={i} />
      ))}
      <Newsletter />
    </>
  );
}

function CategoryShowcaseWrapper({ slug, index }: { slug: string; index: number }) {
  const q = useQuery(catOpts(slug));
  const cat = CATEGORIES.find((c) => c.slug === slug)!;
  if (!q.data?.length) return null;
  return <CategoryShowcase category={cat} products={q.data} index={index} />;
}

