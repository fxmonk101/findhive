import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure — findhive" },
      { name: "description", content: "How findhive earns from qualifying purchases via affiliate links." },
      { property: "og:title", content: "Affiliate Disclosure — findhive" },
      { property: "og:description", content: "How findhive earns from qualifying purchases via affiliate links." },
    ],
  }),
  component: AffiliatePage,
});

function AffiliatePage() {
  return (
    <LegalLayout title="Affiliate Disclosure" updated="July 25, 2026">
      <p>
        findhive is a participant in various affiliate advertising programs designed to provide a means for us to earn fees by linking to retailer websites. This page explains, transparently, how that works.
      </p>

      <h2>How affiliate links work</h2>
      <p>
        When you click certain links on findhive and complete a qualifying purchase at a partner retailer, we may receive a commission. This does <strong>not</strong> change the price you pay, and the retailer's own terms, warranty, and shipping apply.
      </p>

      <h2>Editorial independence</h2>
      <ul>
        <li>Rankings, ratings, and product data are driven by publicly available prices, retailer feeds, and community signals — not by commission rates.</li>
        <li>We do not accept payment for favorable placement in comparison tables or search results.</li>
        <li>Sponsored content, when it appears, is clearly labeled as such.</li>
      </ul>

      <h2>Programs and networks</h2>
      <p>
        findhive works with a variety of affiliate networks and direct retailer programs. Where required by law (e.g. FTC guidelines in the U.S., ASA guidance in the U.K.), we display clear disclosure alongside affiliate content.
      </p>
      <p><em>[Placeholder: list current programs once finalized, e.g. Amazon Associates, Awin, CJ, Impact.]</em></p>

      <h2>Your support</h2>
      <p>
        Using our links helps keep findhive free to use. Thank you — we take that responsibility seriously and only recommend retailers we consider trustworthy.
      </p>

      <h2>Contact</h2>
      <p>Questions about our affiliate practices? Email <em>[partners@findhive.example]</em>.</p>
    </LegalLayout>
  );
}