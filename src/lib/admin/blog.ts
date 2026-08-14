import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { logAudit, slugify } from "./products";

export type BlogPost = Tables<"blog_posts">;

export async function listPosts(status = "all", search = ""): Promise<BlogPost[]> {
  let q = supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).limit(300);
  if (status !== "all") q = q.eq("status", status);
  if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function savePost(values: Partial<TablesInsert<"blog_posts">> & { id?: string; title: string }) {
  const payload = {
    ...values,
    slug: values.slug?.trim() || slugify(values.title),
    published_at:
      values.status === "published" ? (values.published_at ?? new Date().toISOString()) : values.published_at ?? null,
  };
  const { data, error } = await supabase.from("blog_posts").upsert(payload as TablesInsert<"blog_posts">).select("*").single();
  if (error) throw error;
  await logAudit(values.id ? "update" : "create", "blog_post", data.id, null, { title: data.title });
  return data as BlogPost;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  await logAudit("delete", "blog_post", id, null, null);
}
