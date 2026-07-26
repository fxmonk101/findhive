import { ShieldCheck } from "lucide-react";

const partners = [
  { name: "Amazon", url: "https://www.amazon.com" },
  { name: "eBay", url: "https://www.ebay.com" },
  { name: "Walmart", url: "https://www.walmart.com" },
  { name: "AliExpress", url: "https://www.aliexpress.com" },
  { name: "Target", url: "https://www.target.com" },
  { name: "Best Buy", url: "https://www.bestbuy.com" },
  { name: "Etsy", url: "https://www.etsy.com" },
  { name: "Newegg", url: "https://www.newegg.com" },
];

export function Partners() {
  return (
    <section className="border-y border-border bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              <ShieldCheck size={14} /> Trusted Retail Partners
            </div>
            <h2 className="mt-1 text-xl font-bold text-primary md:text-2xl">
              Sourcing from the world's biggest marketplaces
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              We curate authentic listings from Amazon, eBay, Walmart, AliExpress and other verified retailers — so you always get real deals with real reviews.
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {partners.map((p) => (
            <li key={p.name}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex h-16 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold uppercase tracking-wide text-primary transition hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-md"
                title={`Shop deals sourced from ${p.name}`}
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}