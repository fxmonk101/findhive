import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";
import { formatUsd } from "@/lib/format";
import {
  listAdminProducts,
  duplicateProduct,
  deleteProducts,
  setProductStatus,
  type ProductFilters,
} from "@/lib/admin/products";

export const Route = createFileRoute("/admin/_shell/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState<ProductFilters>({ status: "all", sort: "newest" });
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => listAdminProducts(filters),
  });

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action();
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} products in catalog</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
        <Input
          placeholder="Search title, SKU or brand"
          className="h-9 w-full max-w-xs"
          value={filters.search ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          value={filters.category ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          value={filters.status ?? "all"}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          value={filters.stock ?? "all"}
          onChange={(e) =>
            setFilters((f) => ({ ...f, stock: e.target.value as ProductFilters["stock"] }))
          }
        >
          <option value="all">Any stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  Loading products…
                </td>
              </tr>
            )}
            {data?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image_url}
                      alt=""
                      className="h-10 w-10 rounded-lg object-contain"
                      loading="lazy"
                    />
                    <span className="line-clamp-2 max-w-[280px] font-medium text-foreground">
                      {p.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">
                  {p.subcategory.replace(/-/g, " ")}
                </td>
                <td className="px-4 py-3 font-semibold">{formatUsd(Number(p.price))}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stock_count === 0
                        ? "font-semibold text-destructive"
                        : p.stock_count <= p.low_stock_threshold
                          ? "font-semibold text-accent"
                          : "text-muted-foreground"
                    }
                  >
                    {p.stock_count}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-semibold capitalize"
                    value={p.status}
                    onChange={(e) =>
                      run(
                        () => setProductStatus([p.id], e.target.value as "published"),
                        "Status updated",
                      )
                    }
                  >
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Duplicate product"
                      onClick={() => run(() => duplicateProduct(p.id), "Product duplicated")}
                    >
                      <Copy size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete product"
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"? This cannot be undone.`)) {
                          run(() => deleteProducts([p.id]), "Product deleted");
                        }
                      }}
                    >
                      <Trash2 size={15} className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}