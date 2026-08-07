import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { logAudit } from "./products";

export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderStatusRow = Tables<"order_status_history">;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export const PAYMENT_STATUSES = ["unpaid", "awaiting", "paid", "refunded", "failed"] as const;
export const SHIPPING_STATUSES = ["unfulfilled", "packed", "shipped", "delivered"] as const;

export type OrderFilters = {
  search?: string;
  status?: string;
  payment_status?: string;
  sort?: "newest" | "oldest" | "total_desc" | "total_asc";
};

export async function listOrders(filters: OrderFilters = {}): Promise<Order[]> {
  let q = supabase.from("orders").select("*").limit(500);
  if (filters.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    q = q.or(`order_number.ilike.${term},customer_email.ilike.${term},customer_name.ilike.${term}`);
  }
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.payment_status && filters.payment_status !== "all")
    q = q.eq("payment_status", filters.payment_status);
  switch (filters.sort) {
    case "oldest": q = q.order("created_at", { ascending: true }); break;
    case "total_desc": q = q.order("total", { ascending: false }); break;
    case "total_asc": q = q.order("total", { ascending: true }); break;
    default: q = q.order("created_at", { ascending: false });
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getOrder(id: string) {
  const [order, items, history] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id).order("created_at"),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);
  if (order.error) throw order.error;
  return {
    order: (order.data ?? null) as Order | null,
    items: (items.data ?? []) as OrderItem[],
    history: (history.data ?? []) as OrderStatusRow[],
  };
}

export async function updateOrder(id: string, patch: Partial<TablesInsert<"orders">>, previousStatus?: string) {
  const { data, error } = await supabase.from("orders").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  if (patch.status && previousStatus && patch.status !== previousStatus) {
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("order_status_history").insert({
      order_id: id,
      previous_status: previousStatus,
      new_status: patch.status,
      changed_by: auth.user?.id ?? null,
      changed_by_email: auth.user?.email ?? null,
    });
  }
  await logAudit("update", "order", id, null, patch);
  return data as Order;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
  await logAudit("delete", "order", id, null, null);
}
