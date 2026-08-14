import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logAudit } from "./products";

export type AdminProductReview = Tables<"product_reviews"> & {
  products?: { title: string } | null;
};
export type AdminSiteReview = Tables<"site_reviews">;
export type ReviewStatus = "pending" | "approved" | "rejected";

export async function listProductReviewsAdmin(status = "all", search = ""): Promise<AdminProductReview[]> {
  let q = supabase
    .from("product_reviews")
    .select("*,products(title)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status !== "all") q = q.eq("status", status);
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    q = q.or(`author_name.ilike.${term},title.ilike.${term},body.ilike.${term}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as AdminProductReview[];
}

export async function listSiteReviewsAdmin(status = "all"): Promise<AdminSiteReview[]> {
  let q = supabase.from("site_reviews").select("*").order("created_at", { ascending: false }).limit(500);
  if (status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as AdminSiteReview[];
}

export async function setProductReviewStatus(ids: string[], status: ReviewStatus) {
  const { error } = await supabase.from("product_reviews").update({ status }).in("id", ids);
  if (error) throw error;
  await logAudit("status_change", "product_review", ids.join(","), null, { status });
}

export async function setSiteReviewStatus(ids: string[], status: ReviewStatus) {
  const { error } = await supabase.from("site_reviews").update({ status }).in("id", ids);
  if (error) throw error;
  await logAudit("status_change", "site_review", ids.join(","), null, { status });
}

export async function toggleReviewFeatured(table: "product_reviews" | "site_reviews", id: string, featured: boolean) {
  const { error } = await supabase.from(table).update({ featured }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(table: "product_reviews" | "site_reviews", ids: string[]) {
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) throw error;
  await logAudit("delete", table, ids.join(","), null, null);
}
