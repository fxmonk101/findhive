import type { LucideIcon } from "lucide-react";
import { Layers, Watch, Gem, Dumbbell } from "lucide-react";
import catTradingCards from "@/assets/cat-trading-cards.jpg";
import catWatches from "@/assets/cat-watches.jpg";
import catFitness from "@/assets/cat-fitness.jpg";

export type Subcategory = {
  slug: string;
  name: string;
  blurb?: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
  image?: string;
  tagline: string;
  /** SEO intro paragraph shown on the category landing page. */
  intro: string;
  subcategories: Subcategory[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "trading-cards",
    name: "Trading Cards",
    icon: Layers,
    image: catTradingCards,
    tagline: "Pokémon TCG, NBA & NFF sealed product and singles",
    intro:
      "Sealed product, promos and graded-ready singles across Pokémon TCG, NBA and NFL. Every card is pulled from inventory we hold ourselves, sleeved and rigid-loaded before dispatch, and shipped in a tracked bubble mailer so it reaches you exactly as it left the shelf.",
    subcategories: [
      { slug: "pokemon-tcg", name: "Pokémon TCG", blurb: "Booster packs, battle decks, promos and ultra rares" },
      { slug: "nba-cards", name: "NBA Trading Cards", blurb: "Rookies, inserts and numbered parallels" },
      { slug: "nfl-cards", name: "NFL Trading Cards", blurb: "Prizm, Optic and rookie patch autos" },
      { slug: "card-accessories", name: "Card Accessories", blurb: "Sleeves, toploaders and storage" },
    ],
  },
  {
    slug: "watches",
    name: "Watches",
    icon: Watch,
    image: catWatches,
    tagline: "Automatics, divers and everyday classics",
    intro:
      "Men's and women's watches held in our own stock — inspected, battery-checked or wound, and packed in protective boxes. Straps, buckles and crystals are checked one by one before a watch is listed as available to ship.",
    subcategories: [
      { slug: "mens-watches", name: "Men's Watches", blurb: "Divers, chronographs and dress watches" },
      { slug: "womens-watches", name: "Women's Watches", blurb: "Slim cases, bracelets and gold tones" },
      { slug: "watch-accessories", name: "Watch Accessories", blurb: "Straps, tools and cases" },
    ],
  },
  {
    slug: "jewelry",
    name: "Jewelry & Bangles",
    icon: Gem,
    tagline: "Bangles, chains and statement pieces",
    intro:
      "Bangles, bracelets, necklaces and rings selected for finish quality and weight. Each piece is checked for clasp function and plating consistency, then shipped in a gift-ready pouch or box.",
    subcategories: [
      { slug: "bangles-bracelets", name: "Bangles & Bracelets", blurb: "Solid, hinged and stacking styles" },
      { slug: "necklaces", name: "Necklaces & Pendants", blurb: "Chains, lockets and pendants" },
      { slug: "rings", name: "Rings", blurb: "Bands, solitaires and stacks" },
      { slug: "earrings", name: "Earrings", blurb: "Studs, hoops and drops" },
    ],
  },
  {
    slug: "outdoor-fitness",
    name: "Outdoor & Fitness",
    icon: Dumbbell,
    image: catFitness,
    tagline: "Home training gear and outdoor kit",
    intro:
      "Home-gym and outdoor equipment kept in stock in full cartons, including our vibration plate range. Larger items ship on their original pallets or double-boxed, with assembly hardware checked against the manual before dispatch.",
    subcategories: [
      { slug: "camping-hiking", name: "Camping & Hiking", blurb: "Shelters, packs and trail gear" },
      { slug: "fitness-equipment", name: "Fitness Equipment", blurb: "Strength and conditioning tools" },
      { slug: "vibration-plates", name: "Vibration Plate Machines", blurb: "Whole-body vibration trainers" },
      { slug: "cycling", name: "Cycling Gear", blurb: "Components and accessories" },
      { slug: "sports-recreation", name: "Sports & Recreation", blurb: "Court, field and leisure" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryNameBySlug(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function subcategoryNameBySlug(categorySlug: string, subSlug: string): string {
  return getSubcategory(categorySlug, subSlug)?.name ?? subSlug;
}
