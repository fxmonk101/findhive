import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AdminSectionPage({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="flex items-center gap-3">{action}</div>
      </div>
      <div className="grid gap-6">{children}</div>
    </div>
  );
}
