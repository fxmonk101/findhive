import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="bg-primary py-14 text-primary-foreground">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Mail className="mx-auto mb-3 text-accent" size={32} />
        <h2 className="text-2xl font-bold md:text-3xl">Never miss a deal</h2>
        <p className="mt-2 text-primary-foreground/70">Join the hive — get curated price drops and new arrivals in your inbox weekly.</p>
        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return toast.error("Enter a valid email");
            toast.success("Subscribed! Check your inbox.");
            setEmail("");
          }}
        >
          <input
            type="email"
            required
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="min-w-0 flex-1 rounded-full bg-white/10 px-5 py-3 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase text-accent-foreground hover:brightness-95">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}