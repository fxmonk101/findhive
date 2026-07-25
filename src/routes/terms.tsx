import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — findhive" },
      { name: "description", content: "The terms and conditions that govern your use of findhive." },
      { property: "og:title", content: "Terms of Service — findhive" },
      { property: "og:description", content: "The terms and conditions that govern your use of findhive." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 25, 2026">
      <p>
        These Terms of Service ("Terms") govern your access to and use of findhive (the "Service"). By accessing the Service you agree to these Terms.
      </p>
      <p><em>[Placeholder: insert governing law and venue for disputes.]</em></p>

      <h2>1. The Service</h2>
      <p>
        findhive is a comparison shopping platform. We surface product listings, prices, and information from third-party retailers. We do <strong>not</strong> sell products directly. All purchases are transacted between you and the retailer of your choice, subject to that retailer's terms.
      </p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 16 years old (or the age of majority in your jurisdiction) to use the Service.</p>

      <h2>3. Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of any account credentials and for all activity under your account.</p>

      <h2>4. Third-party retailers</h2>
      <p>
        Product availability, pricing, shipping, returns, warranty, and customer support are the sole responsibility of the third-party retailer. findhive makes no warranties about the accuracy or completeness of any listing and is not a party to any purchase transaction.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>Do not scrape, reverse-engineer, or interfere with the Service.</li>
        <li>Do not submit unlawful, misleading, or infringing content (including in reviews).</li>
        <li>Do not misuse affiliate links or attempt to manipulate rankings.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>All content on the Service, other than user-submitted content and third-party product data, is owned by findhive or its licensors. You may not reproduce it without permission.</p>

      <h2>7. User-submitted content</h2>
      <p>By submitting a review or other content you grant findhive a worldwide, royalty-free license to host, display, and distribute it in connection with the Service.</p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINDHIVE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
      </p>

      <h2>10. Changes</h2>
      <p>We may modify these Terms at any time. Continued use of the Service constitutes acceptance of the revised Terms.</p>

      <h2>11. Contact</h2>
      <p>Questions? Email <em>[legal@findhive.example]</em>.</p>
    </LegalLayout>
  );
}