import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DashboardStats = {
  products: { total: number; published: number; draft: number; archived: number };
  stock: { out: number; low: number; units: number };
  revenue: { total: number; last30: number; orders: number; pendingOrders: number };
  reviews: { pending: number; approved: number };
  categories: { name: string; products: number }[];
  lowStock: { id: string; title: string; stock_count: number; low_stock_threshold: number }[];
  recentOrders: Tables<"orders">[];
  salesSeries: { label: string; revenue: number; orders: number }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [{ data: products, error: pErr }, { data: orders }, { data: reviews }] = await Promise.all([
    supabase
      .from("products")
      .select("id,title,category,status,stock_count,low_stock_threshold,price")
      .limit(1000),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("product_reviews").select("id,status").limit(2000),
  ]);
  if (pErr) throw pErr;

  const rows = products ?? [];
  const orderRows = orders ?? [];
  const reviewRows = reviews ?? [];

  const catMap = new Map<string, number>();
  rows.forEach((p) => catMap.set(p.category, (catMap.get(p.category) ?? 0) + 1));

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const salesSeries = Array.from({ length: 14 }, (_, i) => {
    const start = now - (13 - i) * day;
    const dayOrders = orderRows.filter((o) => {
      const t = new Date(o.created_at).getTime();
      return t >= start && t < start + day;
    });
    return {
      label: new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((n, o) => n + Number(o.total), 0),
      orders: dayOrders.length,
    };
  });

  return {
    products: {
      total: rows.length,
      published: rows.filter((p) => p.status === "published").length,
      draft: rows.filter((p) => p.status === "draft").length,
      archived: rows.filter((p) => p.status === "archived").length,
    },
    stock: {
      out: rows.filter((p) => p.stock_count === 0).length,
      low: rows.filter((p) => p.stock_count > 0 && p.stock_count <= p.low_stock_threshold).length,
      units: rows.reduce((n, p) => n + p.stock_count, 0),
    },
    revenue: {
      total: orderRows.reduce((n, o) => n + Number(o.total), 0),
      last30: orderRows
        .filter((o) => now - new Date(o.created_at).getTime() < 30 * day)
        .reduce((n, o) => n + Number(o.total), 0),
      orders: orderRows.length,
      pendingOrders: orderRows.filter((o) => o.status === "pending").length,
    },
    reviews: {
      pending: reviewRows.filter((r) => r.status === "pending").length,
      approved: reviewRows.filter((r) => r.status === "approved").length,
    },
    categories: [...catMap.entries()]
      .map(([name, count]) => ({ name, products: count }))
      .sort((a, b) => b.products - a.products),
    lowStock: rows
      .filter((p) => p.stock_count <= p.low_stock_threshold)
      .sort((a, b) => a.stock_count - b.stock_count)
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        title: p.title,
        stock_count: p.stock_count,
        low_stock_threshold: p.low_stock_threshold,
      })),
    recentOrders: orderRows.slice(0, 6) as Tables<"orders">[],
    salesSeries,
  };
}