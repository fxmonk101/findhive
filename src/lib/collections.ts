import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./products";

const SELECT =
  "id,title,category,subcategory,price,original_price,image_url,rating,review_count,source_retailer,source_url,description,created_at,meta_title,meta_description,short_description,long_description,sold_count,stock_count,viewer_count,images,attributes";

export type Collection = {
  slug: string;
  name: string;
  /** Short label used on tiles and chips. */
  short: string;
  headline: string;
  intro: string;
  /** Title keywords — a product matches if any keyword appears in its title. */
  keywords: string[];
  category?: string;
  subcategory?: string;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "pokemon-booster-packs",
    name: "Pokémon Booster Packs & Sealed",
    short: "Booster Packs",
    headline: "Sealed Pokémon booster packs, sleeved boosters and bundles",
    intro:
      "Factory-sealed Pokémon booster packs and sleeved booster bundles from recent Scarlet & Violet sets through to older reprints. Packs are stored flat, away from light, and shipped in rigid mailers so the wrap arrives uncreased.",
    keywords: ["booster", "sleeved", "bundle"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "pokemon-battle-decks",
    name: "Pokémon Battle Decks & Collections",
    short: "Battle Decks",
    headline: "Ready-to-play Pokémon battle decks, tins and holder collections",
    intro:
      "Complete 60-card battle decks, premier deck holder collections and boxed sets — the fastest way to move from collecting to playing without building a list from scratch.",
    keywords: ["battle deck", "deck", "collection", "case file", "tin"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "pokemon-ultra-rares",
    name: "Pokémon Ultra Rares & Chase Cards",
    short: "Ultra Rares",
    headline: "Ultra rare, hyper rare and full art Pokémon singles",
    intro:
      "Single cards for collectors who already know what they are hunting: full arts, hyper rares, gold foils and VMAX/VSTAR chase cards. Every single is inspected under light for edge wear and surface print lines before listing.",
    keywords: ["ultra rare", "hyper rare", "full art", "vmax", "vstar", "double rare", "shiny"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "pokemon-promos",
    name: "Pokémon Promo Cards",
    short: "Promos",
    headline: "Black Star promos and event-exclusive Pokémon cards",
    intro:
      "Promotional cards distributed through events, boxed sets and retail bundles — often the only place a particular illustration exists. Ideal grading candidates for collectors chasing complete promo runs.",
    keywords: ["promo", "black star", "svp"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "japanese-pokemon",
    name: "Japanese Pokémon Exclusives",
    short: "Japanese",
    headline: "Japanese-print Pokémon cards and exclusives",
    intro:
      "Japanese-print cards and exclusives that never received a Western release. Text is Japanese, card stock and centring standards differ from English prints, and condition is graded to Japanese-market expectations.",
    keywords: ["japan", "japanese"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "charizard-vault",
    name: "The Charizard Vault",
    short: "Charizard",
    headline: "Charizard cards across every era we stock",
    intro:
      "Every Charizard in inventory in one place — VSTAR, ex, Mega and evolution sets. The single most-collected Pokémon line, and the one most worth checking condition on before you buy.",
    keywords: ["charizard"],
    subcategory: "pokemon-tcg",
  },
  {
    slug: "luxury-watches",
    name: "Statement Watches",
    short: "Statement Watches",
    headline: "Automatics, divers and dress watches in stock now",
    intro:
      "Watches selected for case finishing and movement reliability rather than logo alone. Each piece is time-checked and inspected before it leaves inventory.",
    keywords: [],
    category: "watches",
  },
  {
    slug: "gold-tone-bangles",
    name: "Gold-Tone Bangles",
    short: "Gold Bangles",
    headline: "Gold-tone bangles, cuffs and stacking bracelets",
    intro:
      "Bangles and cuffs with consistent plating and secure hinges, checked piece by piece. Stack them or wear them solo — sizing notes are listed on each product page.",
    keywords: ["bangle", "gold", "cuff", "bracelet"],
    category: "jewelry",
  },
  {
    slug: "vibration-training",
    name: "Vibration Plate Training",
    short: "Vibration Plates",
    headline: "Whole-body vibration plates for home training",
    intro:
      "Vibration plate machines for recovery, circulation and low-impact conditioning at home. Motor specs, weight limits and programme counts are listed on every product page so you can match a plate to your floor and routine.",
    keywords: [],
    subcategory: "vibration-plates",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export async function listCollection(slug: string, limit = 60): Promise<Product[]> {
  const col = getCollection(slug);
  if (!col) return [];
  let q = supabase.from("products").select(SELECT).limit(limit);
  if (col.category) q = q.eq("category", col.category);
  if (col.subcategory) q = q.eq("subcategory", col.subcategory);
  if (col.keywords.length) {
    q = q.or(col.keywords.map((k) => `title.ilike.%${k}%`).join(","));
  }
  const { data, error } = await q.order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}
