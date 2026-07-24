import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact findhive" },
      { name: "description", content: "Reach the findhive team with questions, feedback or partnership inquiries." },
      { property: "og:title", content: "Contact findhive" },
      { property: "og:description", content: "Get in touch with the findhive team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Get in touch</span>
        <h1 className="mt-4 text-3xl font-bold text-primary md:text-4xl">We'd love to hear from you</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Questions, feedback, or a partnership idea? Send us a message.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-5">
          {[
            { icon: Mail, label: "Email", value: "hello@findhive.com" },
            { icon: MessageSquare, label: "Support", value: "support@findhive.com" },
            { icon: MapPin, label: "Location", value: "The Hive, Remote-first" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent"><c.icon size={18} /></span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="text-sm font-semibold text-primary">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          className="space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
              const errs: Record<string, string> = {};
              parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
              setErrors(errs);
              return;
            }
            setErrors({});
            toast.success("Message sent — we'll be in touch shortly!");
            setForm({ name: "", email: "", message: "" });
          }}
        >
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-primary">Name</label>
            <input value={form.name} maxLength={100} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-primary">Email</label>
            <input type="email" value={form.email} maxLength={255} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-primary">Message</label>
            <textarea value={form.message} maxLength={1000} rows={5} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:brightness-95" size="lg">Send message</Button>
        </form>
      </div>
    </div>
  );
}