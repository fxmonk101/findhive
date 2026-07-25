import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Heart, Star, ShoppingBag, Clock } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — findhive" },
      { name: "description", content: "Manage your findhive activity — wishlist, comparisons, cart and recently viewed deals." },
      { property: "og:title", content: "My Account — findhive" },
      { property: "og:description", content: "Manage your findhive activity." },
    ],
  }),
  component: AccountPage,
});

const tiles = [
  { title: "Wishlist", desc: "Deals you've saved for later", icon: Heart, to: "/wishlist" as const },
  { title: "Reviews", desc: "See what shoppers are saying", icon: Star, to: "/reviews" as const },
  { title: "Cart", desc: "Items ready to check out", icon: ShoppingBag, to: "/cart" as const },
  { title: "Recently viewed", desc: "Products you've browsed", icon: Clock, to: "/shop" as const },
];

function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
          <User size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">My Account</h1>
          <p className="text-sm text-muted-foreground">Welcome to your findhive dashboard</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.title}
            to={t.to}
            className="group rounded-xl border border-border bg-card p-5 transition hover:border-accent"
          >
            <t.icon size={24} className="text-accent" />
            <h3 className="mt-3 text-base font-bold text-primary group-hover:text-accent">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}