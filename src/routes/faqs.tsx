import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "How does findhive make money?", a: "We earn a small affiliate commission when you buy through our retailer links. It doesn't cost you anything extra and helps keep findhive free." },
  { q: "Are the prices on findhive up to date?", a: "Prices are refreshed regularly, but the final price is always shown on the retailer's site. Always confirm before checking out." },
  { q: "Can I trust the retailers listed?", a: "We only list deals from verified retailers with public return, warranty and support policies." },
  { q: "How many products can I compare at once?", a: "You can compare up to 4 products side by side. Add or remove items via the compare icon on any product card." },
  { q: "Do I need an account?", a: "No — your wishlist, cart and comparisons are saved locally in your browser. You can shop freely without signing up." },
  { q: "How do I contact support?", a: "Visit the Contact page or email support@findhive.com. We usually reply within one business day." },
];

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — findhive" },
      { name: "description", content: "Answers to common questions about findhive, price comparison, retailers and returns." },
      { property: "og:title", content: "FAQs — findhive" },
      { property: "og:description", content: "Answers to common questions about findhive." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">FAQs</span>
      <h1 className="mt-4 text-3xl font-bold text-primary md:text-4xl">Frequently asked questions</h1>
      <p className="mt-2 text-muted-foreground">Everything you need to know about shopping smart with findhive.</p>
      <Accordion type="single" collapsible className="mt-8">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-primary">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}