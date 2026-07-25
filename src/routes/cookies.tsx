import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — findhive" },
      { name: "description", content: "How findhive uses cookies and similar tracking technologies." },
      { property: "og:title", content: "Cookie Policy — findhive" },
      { property: "og:description", content: "How findhive uses cookies and similar tracking technologies." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="July 25, 2026">
      <p>
        This Cookie Policy explains how findhive uses cookies and similar technologies to recognize you when you visit our website.
      </p>

      <h2>1. What are cookies?</h2>
      <p>Cookies are small text files placed on your device by a website. They are widely used to make websites work more efficiently and provide reporting information.</p>

      <h2>2. Cookies we use</h2>
      <ul>
        <li><strong>Strictly necessary:</strong> required for core site functionality such as cart, wishlist, and secure browsing.</li>
        <li><strong>Performance & analytics:</strong> help us understand how visitors interact with the Service (e.g. Google Analytics or similar).</li>
        <li><strong>Functional:</strong> remember preferences such as region and recently viewed items.</li>
        <li><strong>Affiliate & advertising:</strong> allow retailers and networks to attribute referral clicks so we can earn commission.</li>
      </ul>

      <h2>3. Third-party cookies</h2>
      <p>Some cookies are set by third parties (analytics, affiliate networks, embedded widgets). We do not control these cookies — please review the respective provider's policy.</p>
      <p><em>[Placeholder: list current third-party providers once selected.]</em></p>

      <h2>4. Managing cookies</h2>
      <p>You can control cookies through your browser settings and, where applicable, our on-site consent banner. Blocking strictly necessary cookies may impact site functionality.</p>

      <h2>5. Changes</h2>
      <p>We may update this Cookie Policy from time to time.</p>

      <h2>6. Contact</h2>
      <p>Questions about cookies? Email <em>[privacy@findhive.example]</em>.</p>
    </LegalLayout>
  );
}