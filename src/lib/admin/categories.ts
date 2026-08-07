import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { logAudit, slugify } from "./products";

export type CategoryRow = Tables<"categories">;

export async function listCategoryRows(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}

export async function saveCategory(values: Partial<TablesInsert<"categories">> & { id?: string; name: string }) {
  const payload = { ...values, slug: values.slug?.trim() || slugify(values.name) };
  const { data, error } = await supabase.from("categories").upsert(payload as TablesInsert<"categories">).select("*").single();
  if (error) throw error;
  await logAudit(values.id ? "update" : "create", "category", data.id, null, { name: data.name });
  return data as CategoryRow;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  await logAudit("delete", "category", id, null, null);
}

export async function productCountsByCategory() {
  const { data, error } = await supabase.from("products").select("category,subcategory");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
    counts[row.subcategory] = (counts[row.subcategory] ?? 0) + 1;
  }
  return counts;
}
