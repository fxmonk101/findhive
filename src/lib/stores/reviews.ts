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
  verified?: boolean;
  helpful?: number;
};

const seed: Review[] = [
  {
    id: "r1",
    name: "Marcus T.",
    title: "Pulled a solid alt-art in the promo slot",
    body: "Packaging was tight and the box wasn't dinged at all, which matters more than people think for sealed product. Got a great alt-art from the promo pack too. Only wish it shipped slightly faster.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    verified: true,
    helpful: 18,
  },
  {
    id: "r2",
    name: "Priya K.",
    title: "Exactly as pictured",
    body: "Product itself is exactly as pictured and arrived factory sealed. Docking one star just because I've seen this exact set for a bit less elsewhere, but the fast shipping made up for it.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    verified: true,
    helpful: 12,
  },
  {
    id: "r3",
    name: "Denise R.",
    title: "My son's favorite so far",
    body: "He's 9 and obsessed with Greninja so this was an easy win. Cards came pristine, no bent corners, and the box felt fresh when it arrived.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 26,
    verified: true,
    helpful: 21,
  },
  {
    id: "r4",
    name: "James O.",
    title: "Looks way more expensive than it is",
    body: "Been wearing it daily for about 6 weeks now, no scratches on the face yet and the band hasn't stretched out. Battery still going strong and it feels more premium in person than the photos suggested.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 42,
    verified: true,
    helpful: 16,
  },
  {
    id: "r5",
    name: "Alicia F.",
    title: "Nice watch, band runs a little large",
    body: "Had to remove a link to get a comfortable fit but once I did it's great. Keeps accurate time and looks clean with both casual and dressy outfits.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 52,
    helpful: 9,
  },
  {
    id: "r6",
    name: "Kevin B.",
    title: "Quieter than I expected for the price",
    body: "Was worried it'd be loud enough to bother my downstairs neighbor but it's genuinely not bad. Ten minutes a day and I'm already sweating. The remote is easy to use and the intensity range is enough for beginners.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    verified: true,
    helpful: 14,
  },
  {
    id: "r7",
    name: "Monica L.",
    title: "Does the job, assembly took a while",
    body: "Instructions weren't the clearest but got it together in about 25 minutes. Works fine once set up, just wish it came pre-assembled and the remote was a little more responsive.",
    rating: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 70,
    helpful: 7,
  },
  {
    id: "r8",
    name: "Sarah M.",
    title: "Good value and sturdy build",
    body: "The package arrived in good shape and the product looked well made right out of the box. I use it a few times a week and it feels solid without taking up too much floor space.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
    verified: true,
    helpful: 11,
  },
  {
    id: "r9",
    name: "Daniel C.",
    title: "Shipping was surprisingly smooth",
    body: "The box was sealed properly and the cards were in great shape when I opened them. One of the packs had a slight dent in the foil wrap, but the cards themselves were clean and I still got a good hit.",
    rating: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
    verified: true,
    helpful: 10,
  },
  {
    id: "r10",
    name: "Nina W.",
    title: "Simple to set up and comfortable",
    body: "I was nervous about the size, but it fits nicely in my apartment and the low setting is smooth enough for a daily warmup. The instructions were basic but not difficult to follow.",
    rating: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 100,
    verified: true,
    helpful: 13,
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