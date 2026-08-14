import { useState } from "react";
import { BellRing } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const emailSchema = z.string().trim().email("Enter a valid email address").max(160);

export function NotifyMeForm({ productTitle }: { productTitle: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        You're on the list — we'll email you the moment this is back in stock.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = emailSchema.safeParse(email);
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        setError(null);
        setDone(true);
        toast.success("We'll notify you when it's back in stock");
      }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <label htmlFor="notify-email" className="flex items-center gap-2 text-sm font-bold text-primary">
        <BellRing size={16} className="text-accent" /> Notify me when available
      </label>
      <p className="mt-1 text-xs text-muted-foreground">Restock alert for {productTitle}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="notify-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button type="submit" className="rounded-lg bg-accent text-accent-foreground hover:brightness-95">
          Notify me
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </form>
  );
}
