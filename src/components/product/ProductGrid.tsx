import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function ProductGrid({ products, loading, empty }: { products: Product[]; loading?: boolean; empty?: React.ReactNode }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!products.length) {
    return <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">{empty ?? "No products found."}</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}