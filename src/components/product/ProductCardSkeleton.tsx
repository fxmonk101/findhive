export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-square bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-5 w-1/3 rounded bg-muted" />
      </div>
    </div>
  );
}