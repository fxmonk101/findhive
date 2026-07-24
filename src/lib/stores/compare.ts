import { create } from "zustand";
import { persist } from "zustand/middleware";

export const COMPARE_MAX = 4;

type State = {
  ids: string[];
  toggle: (id: string) => { ok: boolean; reason?: string };
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCompare = create<State>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const current = get().ids;
        if (current.includes(id)) {
          set({ ids: current.filter((x) => x !== id) });
          return { ok: true };
        }
        if (current.length >= COMPARE_MAX) {
          return { ok: false, reason: `You can compare up to ${COMPARE_MAX} items at a time.` };
        }
        set({ ids: [...current, id] });
        return { ok: true };
      },
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "findhive-compare" },
  ),
);