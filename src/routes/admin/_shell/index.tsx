import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { formatUsd } from "@/lib/format";

export const Route = createFileRoute("/admin/_shell/")({
  component: AdminDashboard,
});

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: getDashboardStats });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Store overview, inventory health and activity.</p>
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Loading store data…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card
              label="Revenue (all time)"
              value={formatUsd(data.revenue.total)}
              hint={`${formatUsd(data.revenue.last30)} in the last 30 days`}
            />
            <Card
              label="Orders"
              value={String(data.revenue.orders)}
              hint={`${data.revenue.pendingOrders} pending`}
            />
            <Card
              label="Products"
              value={String(data.products.total)}
              hint={`${data.products.published} published · ${data.products.draft} draft`}
            />
            <Card
              label="Stock units"
              value={data.stock.units.toLocaleString()}
              hint={`${data.stock.out} out of stock · ${data.stock.low} low`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">Low stock alerts</h2>
              <ul className="mt-3 divide-y divide-border text-sm">
                {data.lowStock.length === 0 && (
                  <li className="py-2 text-muted-foreground">All products are healthily stocked.</li>
                )}
                {data.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                    <Link
                      to="/admin/products"
                      className="line-clamp-1 font-medium text-foreground hover:text-accent"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        p.stock_count === 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-accent/15 text-accent"
                      }`}
                    >
                      {p.stock_count === 0 ? "Out of stock" : `${p.stock_count} left`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">Catalog by category</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {data.categories.map((c) => (
                  <li key={c.name}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize text-foreground">
                        {c.name.replace(/-/g, " ")}
                      </span>
                      <span className="text-muted-foreground">{c.products}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${Math.round((c.products / (data.products.total || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">Reviews queue</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.reviews.pending} awaiting moderation · {data.reviews.approved} approved
            </p>
          </div>
        </>
      )}
    </div>
  );
}