import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logAudit } from "./products";

export type MediaItem = Tables<"media">;
const BUCKET = "product-images";

export async function listMedia(search = ""): Promise<MediaItem[]> {
  let q = supabase.from("media").select("*").order("created_at", { ascending: false }).limit(300);
  if (search.trim()) q = q.or(`file_name.ilike.%${search.trim()}%,alt_text.ilike.%${search.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

export async function uploadMedia(file: File, folder = "uploads") {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (up.error) throw up.error;
  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw signErr;
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: BUCKET,
      path,
      url: signed.signedUrl,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      folder,
      uploaded_by: auth.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  await logAudit("create", "media", data.id, null, { file: file.name });
  return data as MediaItem;
}

export async function addMediaByUrl(url: string, altText?: string, folder = "external") {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: "external",
      path: url,
      url,
      file_name: url.split("/").pop() ?? "image",
      alt_text: altText ?? null,
      folder,
      uploaded_by: auth.user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as MediaItem;
}

export async function updateMedia(id: string, patch: Partial<MediaItem>) {
  const { error } = await supabase.from("media").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteMedia(item: MediaItem) {
  if (item.bucket !== "external") {
    await supabase.storage.from(item.bucket).remove([item.path]);
  }
  const { error } = await supabase.from("media").delete().eq("id", item.id);
  if (error) throw error;
  await logAudit("delete", "media", item.id, null, null);
}
