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
        findhive ships every order from our own warehouse. This page explains how shipping, delivery, and returns work for products purchased on findhive.
      </p>

      <h2>1. Shipping</h2>
      <p>
        Orders placed by 2pm ET typically ship the same business day; orders placed later ship the next business day. Free standard shipping applies to eligible orders over $75. Tracking is emailed as soon as a label is generated.
      </p>

      <h2>2. Returns, refunds, and exchanges</h2>
      <p>
        We accept returns on eligible items within 30 days of delivery. Items must be unused and in original packaging. Some categories are non-returnable for hygiene or authenticity reasons (e.g. opened sealed trading card product). Refunds are issued to the original payment method within 5-10 business days of us receiving the return.
      </p>

      <h2>3. Damaged or incorrect items</h2>
      <p>
        If your order arrives damaged, incomplete, or incorrect, email <em>support@findhive.shop</em> within 7 days of delivery with photos of the packaging and product. We'll ship a replacement or issue a full refund.
      </p>

      <h2>4. Chargebacks and disputes</h2>
      <p>
        Please reach out to us at <em>support@findhive.shop</em> before initiating a chargeback so we can resolve the issue directly and quickly.
      </p>
    </LegalLayout>
  );
}