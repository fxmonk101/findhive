import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Review = {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number; // 1-5
  createdAt: number;
  productId?: string;
};

const seed: Review[] = [
  {
    id: "r1",
    name: "Maya P.",
    title: "Arrived faster than expected",
    body: "Ordered a Pokémon booster box on a Tuesday and it landed by Friday. Sealed, authentic, exactly as described. This is now my go-to store for TCG restocks.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "r2",
    name: "Jordan R.",
    title: "Real watch, real box, real papers",
    body: "Picked up a men's automatic. Packaging was pristine, everything documented. Customer service replied within the hour when I had a question about the movement.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "r3",
    name: "Priya S.",
    title: "Clean, fast, no clutter",
    body: "The site is refreshingly focused. No dropshipping junk, just curated products they actually stock. Wishlist and cart both work perfectly.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "r4",
    name: "Tomás L.",
    title: "Solid buying experience",
    body: "Fitness gear was well packaged and arrived quickly. Would love to see more colorways in future restocks, but overall very happy.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
  },
  {
    id: "r5",
    name: "Alex K.",
    title: "Trustworthy store",
    body: "Everything about the checkout felt professional — secure payment, clear receipt, prompt shipping notification. I'll be back.",
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