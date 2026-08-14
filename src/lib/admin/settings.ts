import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "./products";

export type SettingsMap = Record<string, Record<string, unknown>>;

export const SETTINGS_KEYS = ["store", "shipping", "payments", "seo"] as const;
export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export const SETTINGS_DEFAULTS: Record<SettingsKey, Record<string, unknown>> = {
  store: { store_name: "findhive", support_email: "support@findhive.com", phone: "", currency: "USD" },
  shipping: { free_shipping_threshold: 150, flat_rate: 9.95, processing_days: "1-2 business days" },
  payments: { card_link: true, zelle: true, cash_app: true, wire: true, instructions: "" },
  seo: { meta_title: "findhive — trending products, restocked and shipped by us", meta_description: "", og_image: "" },
};

export async function loadSettings(): Promise<SettingsMap> {
  const { data, error } = await supabase.from("store_settings").select("key,value");
  if (error) throw error;
  const map: SettingsMap = {};
  for (const k of SETTINGS_KEYS) map[k] = { ...SETTINGS_DEFAULTS[k] };
  for (const row of data ?? []) {
    map[row.key] = { ...(map[row.key] ?? {}), ...(row.value as Record<string, unknown>) };
  }
  return map;
}

export async function saveSettings(key: string, value: Record<string, unknown>) {
  const { error } = await supabase
    .from("store_settings")
    .upsert({ key, value: value as never, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
  await logAudit("update", "settings", key, null, value);
}

export async function listInventoryLogs() {
  const { data, error } = await supabase
    .from("inventory_logs")
    .select("*,products(title,sku)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

export async function listAuditLogs() {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}
