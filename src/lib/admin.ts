import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/lib/products";

export type AdminRole = "super_admin" | "admin";
export type OrderStatus = "pending" | "processing" | "packing" | "shipped" | "completed" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "authorized";
export type ProductStatus = "draft" | "published" | "archived";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export const ADMIN_CATEGORIES = CATEGORIES.filter((category) => category.slug !== "bags");

export const PRODUCT_STATUS: Array<{ value: ProductStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const STOCK_STATUS: Array<{ value: StockStatus; label: string }> = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

export const ORDER_STATUS: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "packing", label: "Packing" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export const PAYMENT_STATUS: Array<{ value: PaymentStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "authorized", label: "Authorized" },
];

export async function getAdminDashboardStats() {
  const [productCount, publishedCount, draftCount, lowStockCount, outOfStockCount, orderCount, pendingOrders, processingOrders, completedOrders, newOrders, customerCount] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_status", "low_stock"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_status", "out_of_stock"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "processing"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "completed"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalProducts: productCount.count ?? 0,
    publishedProducts: publishedCount.count ?? 0,
    draftProducts: draftCount.count ?? 0,
    lowStockProducts: lowStockCount.count ?? 0,
    outOfStockProducts: outOfStockCount.count ?? 0,
    totalOrders: orderCount.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    processingOrders: processingOrders.count ?? 0,
    completedOrders: completedOrders.count ?? 0,
    newOrders: newOrders.count ?? 0,
    totalCustomers: customerCount.count ?? 0,
  };
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function getSeoQuality(product: Partial<Product>) {
  const score = [product.seo_slug, product.meta_title, product.meta_description, product.focus_keyword].filter(Boolean).length;
  if (score <= 1) return "Poor";
  if (score === 2) return "Needs Improvement";
  if (score === 3) return "Good";
  return "Excellent";
}

export function buildProductSchema(product: Partial<Product>) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.short_description || product.long_description || undefined,
    sku: product.sku || undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    image: product.images?.map((image) => (typeof image === 'string' ? image : image.url)),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency ?? 'USD',
      availability: product.stock_count && product.stock_count > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  return schema;
}
