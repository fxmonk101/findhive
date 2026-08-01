import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "How do orders work on findhive?", a: "You place your order on findhive, then receive a secure payment link to complete the transaction. Alternate options like Zelle, Cash App, and wire transfer are also available." },
  { q: "Are the prices on findhive up to date?", a: "Prices are refreshed regularly and shown clearly on each product page before checkout." },
  { q: "What payment methods are available?", a: "Customers can complete payment through the secure link sent after checkout, or choose Zelle, Cash App, or bank transfer if they prefer." },
  { q: "Do I need an account?", a: "No — your wishlist and cart are saved locally in your browser, and you can shop without creating an account." },
  { q: "How do I contact support?", a: "Visit the Contact page or email support@findhive.shop. We usually reply within one business day." },
];

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — findhive" },
      { name: "description", content: "Answers to common questions about ordering, shipping, and payment on findhive." },
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