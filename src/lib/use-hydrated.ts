import { useEffect, useState } from "react";

/** Returns true only after client hydration, to safely read persisted store state. */
export function useHydrated(): boolean {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}