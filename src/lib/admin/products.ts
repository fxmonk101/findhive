import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type AdminProduct = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type ProductStatus = "draft" | "published" | "archived";

export type ProductFilters = {
  search?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  stock?: "all" | "in" | "low" | "out";
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "stock_asc" | "title";
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function listAdminProducts(filters: ProductFilters = {}): Promise<AdminProduct[]> {
  let q = supabase.from("products").select("*").limit(500);

  if (filters.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    q = q.or(`title.ilike.${term},sku.ilike.${term},brand.ilike.${term}`);
  }
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.subcategory) q = q.eq("subcategory", filters.subcategory);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.stock === "out") q = q.eq("stock_count", 0);
  if (filters.stock === "in") q = q.gt("stock_count", 0);

  switch (filters.sort) {
    case "oldest":
      q = q.order("created_at", { ascending: true });
      break;
    case "price_asc":
      q = q.order("price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("price", { ascending: false });
      break;
    case "stock_asc":
      q = q.order("stock_count", { ascending: true });
      break;
    case "title":
      q = q.order("title", { ascending: true });
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as AdminProduct[];
  if (filters.stock === "low") {
    return rows.filter((p) => p.stock_count > 0 && p.stock_count <= p.low_stock_threshold);
  }
  return rows;
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as AdminProduct | null;
}

export async function createProduct(values: TablesInsert<"products">): Promise<AdminProduct> {
  const { data, error } = await supabase.from("products").insert(values).select("*").single();
  if (error) throw error;
  await logAudit("create", "product", data.id, null, { title: data.title });
  return data as AdminProduct;
}

export async function updateProduct(
  id: string,
  values: Partial<TablesInsert<"products">>,
  previousStock?: number,
): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;

  if (
    typeof values.stock_count === "number" &&
    typeof previousStock === "number" &&
    values.stock_count !== previousStock
  ) {
    await logInventory(id, previousStock, values.stock_count, "Manual edit in admin");
  }
  await logAudit("update", "product", id, null, { title: data.title });
  return data as AdminProduct;
}

export async function deleteProducts(ids: string[]) {
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw error;
  await logAudit("delete", "product", ids.join(","), null, { count: ids.length });
}

export async function setProductStatus(ids: string[], status: ProductStatus) {
  const { error } = await supabase.from("products").update({ status }).in("id", ids);
  if (error) throw error;
  await logAudit("status_change", "product", ids.join(","), null, { status, count: ids.length });
}

export async function duplicateProduct(id: string): Promise<AdminProduct> {
  const source = await getAdminProduct(id);
  if (!source) throw new Error("Product not found");

  const {
    id: _id,
    created_at: _created,
    updated_at: _updated,
    ...rest
  } = source;

  const title = `${source.title} (Copy)`;
  const copy = await createProduct({
    ...rest,
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 8)}`,
    sku: source.sku ? `${source.sku}-C` : null,
    status: "draft",
    review_count: 0,
    rating: 0,
    sold_count: 0,
  } as TablesInsert<"products">);

  const images = await listProductImages(id);
  if (images.length) {
    await supabase.from("product_images").insert(
      images.map((img) => ({
        product_id: copy.id,
        url: img.url,
        alt_text: img.alt_text,
        title: img.title,
        caption: img.caption,
        position: img.position,
      })),
    );
  }
  return copy;
}

export async function listProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProductImage[];
}

export async function addProductImage(productId: string, url: string, position: number, alt?: string) {
  const { error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url, position, alt_text: alt ?? null });
  if (error) throw error;
}

export async function updateProductImage(id: string, patch: Partial<ProductImage>) {
  const { error } = await supabase.from("product_images").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProductImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
}

export async function logInventory(
  productId: string,
  previous: number,
  next: number,
  reason: string,
) {
  const { data: auth } = await supabase.auth.getUser();
  await supabase.from("inventory_logs").insert({
    product_id: productId,
    previous_stock: previous,
    new_stock: next,
    change: next - previous,
    reason,
    changed_by: auth.user?.id ?? null,
    changed_by_email: auth.user?.email ?? null,
  });
}

export async function logAudit(
  action: string,
  entityType: string,
  entityId: string | null,
  previous: unknown,
  next: unknown,
) {
  const { data: auth } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    previous_value: (previous ?? null) as never,
    new_value: (next ?? null) as never,
    admin_id: auth.user?.id ?? null,
    admin_email: auth.user?.email ?? null,
  });
}