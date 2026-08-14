import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { logAudit } from "./products";

export type Customer = Tables<"customers">;

export async function listCustomers(search?: string): Promise<Customer[]> {
  let q = supabase.from("customers").select("*").order("created_at", { ascending: false }).limit(500);
  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    q = q.or(`email.ilike.${term},full_name.ilike.${term},phone.ilike.${term}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function customerOrderStats(customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("total,status,created_at")
    .eq("customer_id", customerId);
  if (error) throw error;
  const rows = data ?? [];
  return {
    orders: rows.length,
    lifetime: rows.reduce((n, r) => n + Number(r.total), 0),
    last: rows.map((r) => r.created_at).sort().at(-1) ?? null,
  };
}

export async function upsertCustomer(values: TablesInsert<"customers"> & { id?: string }) {
  const { data, error } = await supabase.from("customers").upsert(values).select("*").single();
  if (error) throw error;
  await logAudit(values.id ? "update" : "create", "customer", data.id, null, { email: data.email });
  return data as Customer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
  await logAudit("delete", "customer", id, null, null);
}
