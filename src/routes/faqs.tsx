import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Ordering",
    items: [
      { q: "Who am I buying from?", a: "findhive is a single brand, not a marketplace. Every item is stocked, inspected and dispatched by us, so there is one seller, one invoice and one point of contact for your order." },
      { q: "Do I need an account to order?", a: "No. You can check out as a guest — your cart and wishlist are saved in your browser. Creating an account simply makes reordering and tracking faster." },
      { q: "Can I change or cancel my order?", a: "Yes, as long as it hasn't shipped. Email support@findhive.shop with your FH- order number within a few hours of ordering and we'll amend or cancel it." },
      { q: "Is the stock count on the page accurate?", a: "It reflects what is physically on our shelves. When an item shows Out of Stock you can join the notify list on the product page and we'll email you the moment it's back." },
    ],
  },
  {
    title: "Payment",
    items: [
      { q: "How does credit card payment work?", a: "For card orders we don't process the card in the browser. Once you place the order we email you a secure, single-use payment link from our payment processor. You complete payment on their hosted, PCI-compliant page and the order moves to packing automatically." },
      { q: "What other payment methods do you accept?", a: "Zelle, Cash App and domestic or international wire transfer. Each option includes written instructions and your unique order reference so the payment is matched to your order." },
      { q: "Is my payment information safe?", a: "Yes. All traffic is protected with 256-bit TLS/SSL, and card details are only ever entered on the payment processor's hosted page — they never touch our servers." },
      { q: "When is my card actually charged?", a: "Only when you complete the secure payment link. Until then the order is held as unpaid and no funds are taken." },
      { q: "Do you charge sales tax?", a: "An estimated tax line is shown at checkout based on your shipping address and is confirmed on your final receipt." },
    ],
  },
  {
    title: "Shipping & tracking",
    items: [
      { q: "How much is shipping?", a: "Orders of $150 or more ship free. Below that, standard shipping is a flat $12 within the US." },
      { q: "How fast will my order arrive?", a: "Orders placed before 2pm ET on a business day are packed the same day. Standard delivery is typically 3–7 business days in the US." },
      { q: "How do I track my order?", a: "Use the Track Order page with your FH- order number and the email you used at checkout." },
      { q: "Do you ship internationally?", a: "Yes, to most countries. International rates and transit times are calculated at checkout, and any import duties are the buyer's responsibility." },
    ],
  },
  {
    title: "Products & authenticity",
    items: [
      { q: "Are trading cards factory sealed?", a: "Sealed product — booster boxes, blasters, mega boxes and decks — arrives exactly as it left the manufacturer. We never open, weigh or resell sealed inventory." },
      { q: "Are the watches and jewelry authentic?", a: "Every watch and jewelry piece is sourced through authorised supply lines and inspected before dispatch. Anything with a cosmetic flaw is pulled from stock rather than shipped." },
      { q: "Do products come with a warranty?", a: "Watches and fitness equipment carry the manufacturer's warranty where one is offered. Warranty details are listed in the Additional Information tab on each product page." },
    ],
  },
  {
    title: "Returns & support",
    items: [
      { q: "What is your return policy?", a: "Unopened items can be returned within 30 days of delivery for a refund to the original payment method. See Shipping & Returns for the full policy and exclusions." },
      { q: "My item arrived damaged — what now?", a: "Send photos of the item and outer packaging within 48 hours of delivery and we'll ship a replacement or refund you in full, including return postage." },
      { q: "Can I leave a review?", a: "Yes. Open the Reviews tab on any product page, or use the Reviews page to see what other customers are saying and share your own experience." },
      { q: "How do I reach a human?", a: "Email support@findhive.shop or use the Contact page. We reply within one business day, Monday to Friday." },
    ],
  },
];

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Orders, Payment & Shipping | findhive" },
      { name: "description", content: "Answers about findhive orders, secure card payment links, shipping times, order tracking, authenticity and returns." },
      { property: "og:title", content: "FAQs — Orders, Payment & Shipping | findhive" },
      { property: "og:description", content: "Everything about ordering, payment, shipping, authenticity and returns at findhive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">FAQs</span>
      <h1 className="mt-4 text-3xl font-black text-primary md:text-4xl">Frequently asked questions</h1>
      <p className="mt-2 text-muted-foreground">
        Ordering, payment, shipping, authenticity and returns — all in one place. Still stuck?{" "}
        <Link to="/contact" className="font-semibold text-accent hover:brightness-90">Contact us</Link> or{" "}
        <Link to="/track-order" className="font-semibold text-accent hover:brightness-90">track your order</Link>.
      </p>
      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2 className="text-lg font-bold text-primary">{g.title}</h2>
          <Accordion type="single" collapsible className="mt-2">
            {g.items.map((f, i) => (
              <AccordionItem key={i} value={`${g.title}-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-primary">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  );
}