import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Tag,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Store,
} from "lucide-react";
import { getAdminContext, adminSignOut } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/_shell")({
  ssr: false,
  beforeLoad: async () => {
    const admin = await getAdminContext();
    if (!admin) throw redirect({ to: "/admin/login" });
    return { admin };
  },
  component: AdminShell,
});

type NavItem = {
  to: "/admin" | "/admin/products" | "/admin/orders";
  label: string;
  icon: typeof LayoutDashboard;
  exact: boolean;
  soon?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { to: "/admin", label: "Customers", icon: Users, exact: false, soon: true },
  { to: "/admin", label: "Reviews", icon: Star, exact: false, soon: true },
  { to: "/admin", label: "Promotions", icon: Tag, exact: false, soon: true },
  { to: "/admin", label: "Blog", icon: FileText, exact: false, soon: true },
  { to: "/admin", label: "Settings", icon: Settings, exact: false, soon: true },
];

function AdminShell() {
  const { admin } = Route.useRouteContext();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  async function signOut() {
    await adminSignOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col bg-primary text-primary-foreground transition-all ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center gap-2 px-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground font-black">
            f
          </span>
          {!collapsed && <span className="truncate text-sm font-black">findhive admin</span>}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-3">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              inactiveProps={{ className: "text-primary-foreground/75 hover:bg-white/10" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold"
              title={item.label}
            >
              <item.icon size={17} className="shrink-0" />
              {!collapsed && (
                <span className="flex-1 truncate">
                  {item.label}
                  {item.soon && <span className="ml-1 text-[10px] opacity-60">soon</span>}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-2">
          <a
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-primary-foreground/75 hover:bg-white/10"
          >
            <Store size={17} className="shrink-0" />
            {!collapsed && <span>View store</span>}
          </a>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-primary-foreground/75 hover:bg-white/10"
          >
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">{admin.email}</span>
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
              {admin.isSuperAdmin ? "Super admin" : "Admin"}
            </span>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}