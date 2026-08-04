import type { LucideIcon } from "lucide-react";
import { Layers, Watch, Gem, Backpack, Mountain } from "lucide-react";
import catTradingCards from "@/assets/cat-trading-cards.jpg";
import catWatches from "@/assets/cat-watches.jpg";
import catFitness from "@/assets/cat-fitness.jpg";

export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
  image?: string;
  subcategories: Subcategory[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "trading-cards",
    name: "Trading Cards",
    icon: Layers,
    image: catTradingCards,
    subcategories: [
      { slug: "pokemon-tcg", name: "Pokémon TCG" },
      { slug: "nba-cards", name: "NBA Trading Cards" },
      { slug: "nfl-cards", name: "NFL Trading Cards" },
      { slug: "card-accessories", name: "Card Accessories" },
    ],
  },
  {
    slug: "watches",
    name: "Watches",
    icon: Watch,
    image: catWatches,
    subcategories: [
      { slug: "mens-watches", name: "Men's Watches" },
      { slug: "womens-watches", name: "Women's Watches" },
      { slug: "watch-accessories", name: "Watch Accessories" },
    ],
  },
  {
    slug: "jewelry",
    name: "Jewelry & Bangles",
    icon: Gem,
    subcategories: [
      { slug: "bangles-bracelets", name: "Bangles & Bracelets" },
      { slug: "necklaces", name: "Necklaces & Pendants" },
      { slug: "rings", name: "Rings" },
      { slug: "earrings", name: "Earrings" },
    ],
  },
  {
    slug: "bags",
    name: "Bags",
    icon: Backpack,
    subcategories: [
      { slug: "handbags", name: "Handbags & Purses" },
      { slug: "backpacks", name: "Backpacks" },
      { slug: "travel-bags", name: "Travel & Duffel Bags" },
      { slug: "wallets", name: "Wallets & Small Accessories" },
    ],
  },
  {
    slug: "outdoor-fitness",
    name: "Outdoor & Fitness",
    icon: Mountain,
    image: catFitness,
    subcategories: [
      { slug: "camping-hiking", name: "Camping & Hiking" },
      { slug: "fitness-equipment", name: "Fitness Equipment" },
      { slug: "vibration-plates", name: "Vibration Plate Machines" },
      { slug: "cycling", name: "Cycling Gear" },
      { slug: "sports-recreation", name: "Sports & Recreation" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategory(
  categorySlug: string,
  subSlug: string,
): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryNameBySlug(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}

export function subcategoryNameBySlug(
  categorySlug: string,
  subSlug: string,
): string {
  return getSubcategory(categorySlug, subSlug)?.name ?? subSlug;
}