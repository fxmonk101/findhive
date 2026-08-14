import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  original_price: number | null;
  image_url: string;
  rating: number;
  review_count: number;
  source_retailer: string;
  source_url: string;
  description: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  short_description: string | null;
  long_description: string | null;
  sold_count: number;
  stock_count: number;
  viewer_count: number;
  images: string[];
  attributes: Record<string, string>;
};

const SELECT =
  "id,title,category,subcategory,price,original_price,image_url,rating,review_count,source_retailer,source_url,description,created_at,meta_title,meta_description,short_description,long_description,sold_count,stock_count,viewer_count,images,attributes";

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function listByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("category", category)
    .eq("status", "published")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function listBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("category", category)
    .eq("subcategory", subcategory)
    .eq("status", "published")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Product | null;
}

export async function searchProducts(query: string, category?: string, limit = 40): Promise<Product[]> {
  let q = supabase.from("products").select(SELECT).eq("status", "published").limit(limit);
  if (query.trim()) q = q.ilike("title", `%${query.trim()}%`);
  if (category) q = q.eq("category", category);
  const { data, error } = await q.order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getFeatured(limit = 8): Promise<Product[]> {
  // Trending leads with sealed Pokémon boxes/bundles, then fills with top-rated stock.
  const sealed = await supabase
    .from("products")
    .select(SELECT)
    .eq("status", "published")
    .eq("subcategory", "pokemon-tcg")
    .gt("stock_count", 0)
    .or(
      "title.ilike.%booster box%,title.ilike.%elite trainer box%,title.ilike.%booster bundle%,title.ilike.%display%,title.ilike.%collection box%,title.ilike.%premium collection%,title.ilike.%tin%,title.ilike.%bundle%",
    )
    .order("sold_count", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);
  if (sealed.error) throw sealed.error;
  const boxes = (sealed.data ?? []) as Product[];
  if (boxes.length >= limit) return boxes.slice(0, limit);

  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("status", "published")
    .gt("stock_count", 0)
    .order("rating", { ascending: false })
    .order("review_count", { ascending: false })
    .limit(limit * 2);
  if (error) throw error;
  const rest = ((data ?? []) as Product[]).filter((p) => !boxes.some((b) => b.id === p.id));
  return [...boxes, ...rest].slice(0, limit);
}

export async function getRelated(category: string, excludeId: string, limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("category", category)
    .eq("status", "published")
    .neq("id", excludeId)
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getManyByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const { data, error } = await supabase.from("products").select(SELECT).in("id", ids);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function autocomplete(q: string, limit = 6): Promise<Product[]> {
  if (!q.trim()) return [];
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("status", "published")
    .ilike("title", `%${q.trim()}%`)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Product[];
}