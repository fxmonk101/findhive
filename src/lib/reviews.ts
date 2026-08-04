import { supabase } from "@/integrations/supabase/client";

export type ProductReview = {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  verified_purchase: boolean;
  created_at: string;
};

export type ProductReviewWithProduct = ProductReview & {
  products: { id: string; title: string; image_url: string; category: string } | null;
};

const SELECT = "id,product_id,author_name,rating,title,body,verified_purchase,created_at";

export async function listProductReviews(productId: string): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from("product_reviews")
    .select(SELECT)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductReview[];
}

export async function listLatestReviews(limit = 24): Promise<ProductReviewWithProduct[]> {
  const { data, error } = await supabase
    .from("product_reviews")
    .select(`${SELECT},products(id,title,image_url,category)`)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductReviewWithProduct[];
}

export async function submitProductReview(input: {
  product_id: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
}): Promise<void> {
  const { error } = await supabase
    .from("product_reviews")
    .insert({ ...input, verified_purchase: false });
  if (error) throw error;
}