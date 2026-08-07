export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-black text-primary md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    /paid|published|approved|delivered|active/i.test(value)
      ? "bg-emerald-100 text-emerald-800"
      : /pending|unpaid|draft|awaiting|processing|unfulfilled/i.test(value)
        ? "bg-amber-100 text-amber-800"
        : /cancel|refund|reject|failed|archiv/i.test(value)
          ? "bg-rose-100 text-rose-800"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tone}`}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">{label}</div>;
}
