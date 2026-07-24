import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 8;

type State = {
  ids: string[];
  visit: (id: string) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<State>()(
  persist(
    (set) => ({
      ids: [],
      visit: (id) =>
        set((s) => {
          const filtered = s.ids.filter((x) => x !== id);
          return { ids: [id, ...filtered].slice(0, MAX) };
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: "findhive-recent" },
  ),
);