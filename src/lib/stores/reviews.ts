import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Review = {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number; // 1-5
  createdAt: number;
};

const seed: Review[] = [
  {
    id: "r1",
    name: "Maya P.",
    title: "Saved me hours of tab-hopping",
    body: "I was hunting for a specific Pokémon booster box and findhive lined up every trusted retailer in one view. Bought in five minutes for the best price I found anywhere.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "r2",
    name: "Jordan R.",
    title: "Great for watch shopping",
    body: "The watch category is well curated. Wish there were a few more boutique retailers, but pricing was accurate and the deal I clicked was still live.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "r3",
    name: "Priya S.",
    title: "Clean, fast, no clutter",
    body: "Love that it's just the categories I care about. No dropshipping junk. The wishlist is genuinely useful.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "r4",
    name: "Tomás L.",
    title: "Solid but could grow",
    body: "Good deals across bags and outdoor gear. Would love price-drop alerts in the future.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
  },
  {
    id: "r5",
    name: "Alex K.",
    title: "Honest affiliate site",
    body: "Appreciate the transparent disclosure. Rankings didn't feel pay-to-play — the top deal really was the cheapest.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
];

type State = {
  reviews: Review[];
  add: (r: Omit<Review, "id" | "createdAt">) => void;
};

export const useReviews = create<State>()(
  persist(
    (set) => ({
      reviews: seed,
      add: (r) =>
        set((s) => ({
          reviews: [
            { ...r, id: crypto.randomUUID(), createdAt: Date.now() },
            ...s.reviews,
          ],
        })),
    }),
    { name: "findhive-reviews" },
  ),
);