import type { ReactNode } from "react";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Legal</span>
      <h1 className="mt-4 text-3xl font-black text-primary md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      <div className="prose prose-slate mt-8 max-w-none text-sm leading-relaxed text-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-6 [&_h3]:font-bold [&_h3]:text-primary [&_p]:mt-3 [&_p]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground [&_li]:mt-1 [&_a]:text-accent [&_a:hover]:underline">
        {children}
      </div>
    </div>
  );
}