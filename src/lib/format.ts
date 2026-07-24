export function formatPrice(n: number | null | undefined): string {
  if (n == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export function percentOff(price: number, original: number | null | undefined): number | null {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}