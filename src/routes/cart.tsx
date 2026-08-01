import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — findhive" },
      { name: "description", content: "Your saved deals to shop from findhive." },
      { property: "og:title", content: "Your Cart — findhive" },
      { property: "og:description", content: "Your saved deals ready to shop." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
          <ShoppingBag size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">Your Cart</h1>
          <p className="text-sm text-muted-foreground">{hydrated ? items.length : 0} items</p>
        </div>
      </div>

      {hydrated && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4"><Link to="/shop">Continue shopping</Link></Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                <img src={i.image_url} alt={i.title} className="h-24 w-24 shrink-0 rounded object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to="/product/$id" params={{ id: i.id }} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-accent">{i.title}</Link>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded border border-border">
                      <button onClick={() => setQty(i.id, Math.max(1, i.quantity - 1))} aria-label="Decrease" className="grid h-8 w-8 place-items-center hover:bg-muted"><Minus size={12} /></button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => setQty(i.id, i.quantity + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center hover:bg-muted"><Plus size={12} /></button>
                    </div>
                    <div className="text-base font-bold text-primary">{formatPrice(i.price * i.quantity)}</div>
                  </div>
                </div>
                <button onClick={() => remove(i.id)} aria-label="Remove" className="grid h-8 w-8 shrink-0 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-destructive"><X size={16} /></button>
              </li>
            ))}
            <li className="text-right">
              <button onClick={clear} className="text-xs font-semibold uppercase text-muted-foreground hover:text-destructive">Clear cart</button>
            </li>
          </ul>
          <aside className="h-fit rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-primary">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base"><span className="font-bold text-primary">Total</span><span className="font-bold text-primary">{formatPrice(subtotal + shipping)}</span></div>
            </div>
            <Button
              className="mt-5 w-full bg-accent text-accent-foreground hover:brightness-95"
              size="lg"
              disabled={items.length === 0}
              onClick={() => navigate({ to: "/checkout" })}
            >
              Proceed to Checkout
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout · Payment link sent after order confirmation.</p>
          </aside>
        </div>
      )}
    </div>
  );
}