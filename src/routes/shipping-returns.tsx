import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns — findhive" },
      { name: "description", content: "How shipping, delivery, and returns work for products discovered via findhive." },
      { property: "og:title", content: "Shipping & Returns — findhive" },
      { property: "og:description", content: "How shipping, delivery, and returns work for products discovered via findhive." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Returns Policy" updated="July 25, 2026">
      <p>
        findhive is a comparison shopping platform, not a direct retailer. We do <strong>not</strong> ship products or process returns ourselves. All orders are placed with, fulfilled by, and returned to the third-party retailer you choose from a findhive listing.
      </p>

      <h2>1. Where to find shipping details</h2>
      <p>
        Shipping fees, delivery windows, tracking, and international availability are set by each retailer. Please review the retailer's shipping information at checkout before completing your purchase.
      </p>

      <h2>2. Returns, refunds, and exchanges</h2>
      <p>
        Return windows, restocking fees, and refund methods vary by retailer and product category. Consult the retailer's returns page or receipt for the applicable terms. As a general guide:
      </p>
      <ul>
        <li>Most retailers offer a 14-30 day return window for unused items in original packaging.</li>
        <li>Some categories (e.g. graded trading cards, personalized jewelry, opened sealed product) are typically non-returnable.</li>
        <li>Refunds are usually issued to the original payment method within 5-10 business days of the retailer receiving the return.</li>
      </ul>
      <p><em>[Placeholder: link to top retailers' return policies once partnerships are confirmed.]</em></p>

      <h2>3. Damaged or incorrect items</h2>
      <p>
        Contact the retailer directly and, where possible, keep photos of the packaging and product. Most partner retailers have dedicated support channels for damaged or incorrect shipments.
      </p>

      <h2>4. How findhive can help</h2>
      <p>
        While we cannot process refunds or ship replacements, we can help you reach the right retailer contact and follow up. Email <em>[support@findhive.example]</em> with your order details.
      </p>

      <h2>5. Chargebacks and disputes</h2>
      <p>
        Payment disputes should be handled with the retailer first. If unresolved, your payment provider (card issuer, PayPal, etc.) is typically the next step.
      </p>
    </LegalLayout>
  );
}