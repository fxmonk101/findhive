import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — findhive" },
      { name: "description", content: "How findhive collects, uses, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — findhive" },
      { property: "og:description", content: "How findhive collects, uses, and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 25, 2026">
      <p>
        This Privacy Policy explains how findhive ("we", "us", or "our") collects, uses, and shares information about you when you use our online store (the "Service"). By using the Service you agree to the practices described here.
      </p>
      <p><em>[Placeholder: insert full legal entity name, registered address, and jurisdiction of operation.]</em></p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Information you provide:</strong> name, email, shipping address, phone, payment details at checkout, review content, contact form submissions.</li>
        <li><strong>Usage data:</strong> pages viewed, products clicked, referring URL, device and browser type, approximate location derived from IP.</li>
        <li><strong>Cookies and similar technologies:</strong> see our <a href="/cookies">Cookie Policy</a>.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To operate, maintain, and improve the Service.</li>
        <li>To fulfil your orders, process payments, and ship your products.</li>
        <li>To send transactional and marketing communications (you can opt out any time).</li>
        <li>To detect, prevent, and address fraud or abuse.</li>
      </ul>

      <h2>3. How we share information</h2>
      <p>
        findhive does <strong>not</strong> sell your personal data. We share limited information with:
      </p>
      <ul>
        <li>Payment processors (to charge your card and detect fraud).</li>
        <li>Shipping carriers (to deliver your order).</li>
        <li>Service providers (hosting, analytics, email) under written data-processing terms.</li>
        <li>Authorities when legally compelled.</li>
      </ul>

      <h2>4. Your rights</h2>
      <p>
        Depending on your jurisdiction (e.g. GDPR/UK GDPR, CCPA), you may have rights to access, correct, delete, port, or restrict processing of your personal data. Contact us at <em>[privacy@findhive.example]</em> to exercise these rights.
      </p>

      <h2>5. Data retention</h2>
      <p>We retain personal data only as long as necessary for the purposes described above or as required by law.</p>

      <h2>6. Security</h2>
      <p>We use industry-standard measures to protect your data, but no online service is 100% secure.</p>

      <h2>7. Children</h2>
      <p>The Service is not directed to children under 16. We do not knowingly collect personal information from children.</p>

      <h2>8. Changes to this policy</h2>
      <p>We may update this Policy from time to time. Material changes will be posted on this page with an updated effective date.</p>

      <h2>9. Contact</h2>
      <p>Questions? Email us at <em>[privacy@findhive.example]</em>.</p>
    </LegalLayout>
  );
}