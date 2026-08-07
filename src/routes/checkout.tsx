import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Wallet, Building2, Smartphone, Lock } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { PaymentIcons } from "@/components/product/PaymentIcons";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — findhive" },
      { name: "description", content: "Complete your findhive order securely with Zelle, Credit Card, Cash App or Wire Transfer." },
      { property: "og:title", content: "Secure Checkout — findhive" },
      { property: "og:description", content: "Fast, secure checkout with multiple payment options." },
    ],
  }),
  component: CheckoutPage,
});

type PayMethod = "card" | "zelle" | "cashapp" | "wire";

const methods: { id: PayMethod; label: string; desc: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex, Discover", icon: CreditCard },
  { id: "zelle", label: "Zelle", desc: "Instant bank-to-bank transfer", icon: Wallet },
  { id: "cashapp", label: "Cash App", desc: "Pay with $cashtag", icon: Smartphone },
  { id: "wire", label: "Wire Transfer", desc: "Domestic & international wires", icon: Building2 },
];

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {done ? <CheckCircle2 size={14} /> : n}
      </span>
      <span className={`text-sm font-semibold ${active || done ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}

function CheckoutPage() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [contact, setContact] = useState({ email: "", firstName: "", lastName: "", phone: "", address1: "", address2: "", city: "", state: "", zip: "", country: "United States" });
  const [method, setMethod] = useState<PayMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [zelle, setZelle] = useState({ emailOrPhone: "", memo: "" });
  const [cashapp, setCashapp] = useState({ cashtag: "" });
  const [wire, setWire] = useState({ bankName: "", accountName: "", reference: "" });

  const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = subtotal + shipping + tax;

  const canContinueContact = contact.email && contact.firstName && contact.lastName && contact.address1 && contact.city && contact.state && contact.zip;

  function canPlace() {
    if (method === "card") return card.number.replace(/\s/g, "").length >= 15 && card.exp.length >= 4 && card.cvc.length >= 3 && card.name;
    if (method === "zelle") return zelle.emailOrPhone.length > 4;
    if (method === "cashapp") return cashapp.cashtag.startsWith("$") && cashapp.cashtag.length > 2;
    if (method === "wire") return wire.bankName && wire.accountName;
    return false;
  }

  function placeOrder() {
    if (!canPlace()) {
      toast.error("Please complete your payment details.");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const id = "FH-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      setOrderId(id);
      setStep(3);
      clear();
      setPlacing(false);
    }, 900);
  }

  if (hydrated && items.length === 0 && step !== 3) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add products to your cart before checking out.</p>
        <Button asChild className="mt-6"><Link to="/shop">Continue shopping</Link></Button>
      </div>
    );
  }

  if (step === 3 && orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-accent">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-primary">Order confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks {contact.firstName || "friend"} — your order has been placed successfully.
        </p>
        
        {/* Order Details Card */}
        <div className="mx-auto mt-6 max-w-sm rounded-lg border border-border bg-card p-5 text-left">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Order Details</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-bold text-primary">{orderId}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Payment Method</span><span className="font-semibold capitalize">{method === "cashapp" ? "Cash App" : method === "card" ? "Credit/Debit Card" : method}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span className="font-semibold text-foreground">{contact.email}</span></div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
            <span className="font-bold text-primary">Total Amount</span>
            <span className="font-bold text-xl text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mx-auto mt-4 max-w-sm rounded-lg border border-accent/40 bg-accent/10 p-4 text-left text-sm text-foreground">
          <p className="font-semibold text-primary">Payment Instructions</p>
          {method === "card" && <p className="mt-1">Your card has been charged {formatPrice(total)}. An invoice will be sent to <b>{contact.email}</b> shortly.</p>}
          {method === "zelle" && <p className="mt-1">Send <b>{formatPrice(total)}</b> via Zelle to <b>payments@findhive.shop</b> with memo <b>{orderId}</b>. An invoice will be sent to <b>{contact.email}</b> once payment is received.</p>}
          {method === "cashapp" && <p className="mt-1">Send <b>{formatPrice(total)}</b> to <b>$findhive</b> on Cash App and include <b>{orderId}</b> in the note. An invoice will be sent to <b>{contact.email}</b> once payment is received.</p>}
          {method === "wire" && <p className="mt-1">Wire transfer details and reference <b>{orderId}</b> will be sent to <b>{contact.email}</b> within a few minutes. Please complete the wire transfer to finalize your order. An invoice will be sent after payment is confirmed.</p>}
        </div>

        {/* Order Summary */}
        <div className="mx-auto mt-4 max-w-sm rounded-lg border border-border bg-card p-4 text-left">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (est.)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base">
            <span className="font-bold text-primary">Total</span>
            <span className="font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/account" })}>View account</Button>
          <Button className="bg-accent text-accent-foreground hover:brightness-95" onClick={() => navigate({ to: "/shop" })}>Keep shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-primary md:text-3xl">Secure Checkout</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card p-4">
        <Step n={1} label="Details" active={step === 1} done={step > 1} />
        <div className="h-px w-8 bg-border" />
        <Step n={2} label="Payment" active={step === 2} done={step > 2} />
        <div className="h-px w-8 bg-border" />
        <Step n={3} label="Confirm" active={false} done={false} />
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Lock size={12} /> SSL encrypted</div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 1 && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-primary">Contact & shipping</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" full />
                <Field label="First name" value={contact.firstName} onChange={(v) => setContact({ ...contact, firstName: v })} />
                <Field label="Last name" value={contact.lastName} onChange={(v) => setContact({ ...contact, lastName: v })} />
                <Field label="Phone" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} full />
                <Field label="Address" value={contact.address1} onChange={(v) => setContact({ ...contact, address1: v })} full />
                <Field label="Apt, suite (optional)" value={contact.address2} onChange={(v) => setContact({ ...contact, address2: v })} full />
                <Field label="City" value={contact.city} onChange={(v) => setContact({ ...contact, city: v })} />
                <Field label="State / Province" value={contact.state} onChange={(v) => setContact({ ...contact, state: v })} />
                <Field label="ZIP / Postal code" value={contact.zip} onChange={(v) => setContact({ ...contact, zip: v })} />
                <Field label="Country" value={contact.country} onChange={(v) => setContact({ ...contact, country: v })} />
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-accent text-accent-foreground hover:brightness-95"
                  disabled={!canContinueContact}
                  onClick={() => setStep(2)}
                >
                  Continue to payment
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-primary">Payment method</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {methods.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${active ? "border-accent bg-accent/5 ring-2 ring-accent/40" : "border-border hover:border-accent/60"}`}
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-md ${active ? "bg-accent text-accent-foreground" : "bg-muted text-primary"}`}>
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-primary">{m.label}</span>
                        <span className="block text-xs text-muted-foreground">{m.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                {method === "card" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Card number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="1234 5678 9012 3456" full />
                    <Field label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} full />
                    <Field label="Expiry (MM/YY)" value={card.exp} onChange={(v) => setCard({ ...card, exp: v })} placeholder="04/29" />
                    <Field label="CVC" value={card.cvc} onChange={(v) => setCard({ ...card, cvc: v })} placeholder="123" />
                  </div>
                )}
                {method === "zelle" && (
                  <div className="grid gap-3">
                    <Field label="Your Zelle email or phone" value={zelle.emailOrPhone} onChange={(v) => setZelle({ ...zelle, emailOrPhone: v })} full />
                    <Field label="Memo (optional)" value={zelle.memo} onChange={(v) => setZelle({ ...zelle, memo: v })} full />
                    <p className="text-xs text-muted-foreground">After placing the order you'll receive Zelle payment instructions and an order reference.</p>
                  </div>
                )}
                {method === "cashapp" && (
                  <div className="grid gap-3">
                    <Field label="Your $cashtag" value={cashapp.cashtag} onChange={(v) => setCashapp({ cashtag: v })} placeholder="$yourname" full />
                    <p className="text-xs text-muted-foreground">We'll send Cash App payment instructions to your email after you place the order.</p>
                  </div>
                )}
                {method === "wire" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Sending bank" value={wire.bankName} onChange={(v) => setWire({ ...wire, bankName: v })} full />
                    <Field label="Account holder name" value={wire.accountName} onChange={(v) => setWire({ ...wire, accountName: v })} full />
                    <Field label="Reference (optional)" value={wire.reference} onChange={(v) => setWire({ ...wire, reference: v })} full />
                    <p className="col-span-full text-xs text-muted-foreground">Wire instructions will be emailed to you with a unique order reference.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button className="text-sm font-semibold text-muted-foreground hover:text-primary" onClick={() => setStep(1)}>← Back</button>
                <Button
                  className="bg-accent text-accent-foreground hover:brightness-95"
                  disabled={!canPlace() || placing}
                  onClick={placeOrder}
                >
                  {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Order summary</h2>
            <ul className="max-h-72 space-y-3 overflow-auto">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <img src={i.image_url} alt={i.title} className="h-14 w-14 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-xs font-semibold text-foreground">{i.title}</div>
                    <div className="text-xs text-muted-foreground">Qty {i.quantity}</div>
                  </div>
                  <div className="text-sm font-bold text-primary">{formatPrice(i.price * i.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
              <Row label="Tax (est.)" value={formatPrice(tax)} />
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base">
                <span className="font-bold text-primary">Total</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-primary"><Lock size={14} className="text-accent" /> SSL Secured · 256-bit encryption</div>
            <p className="mt-1">Your payment details are protected in transit with industry-standard TLS/SSL encryption.</p>
            <div className="mt-3">
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Accepted payments</div>
              <PaymentIcons tone="dark" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, full }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}