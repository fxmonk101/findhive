import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { logAudit } from "./products";

export type Promotion = Tables<"promotions">;

export async function listPromotions(): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data ?? []) as Promotion[];
}

export async function savePromotion(values: Partial<TablesInsert<"promotions">> & { id?: string; code: string }) {
  const payload = { ...values, code: values.code.trim().toUpperCase() };
  const { data, error } = await supabase.from("promotions").upsert(payload as TablesInsert<"promotions">).select("*").single();
  if (error) throw error;
  await logAudit(values.id ? "update" : "create", "promotion", data.id, null, { code: data.code });
  return data as Promotion;
}

export async function togglePromotion(id: string, is_active: boolean) {
  const { error } = await supabase.from("promotions").update({ is_active }).eq("id", id);
  if (error) throw error;
}

export async function deletePromotion(id: string) {
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw error;
  await logAudit("delete", "promotion", id, null, null);
}
