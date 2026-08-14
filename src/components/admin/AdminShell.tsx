import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Box,
  FileText,
  Home,
  ImagePlus,
  Layers,
  LogOut,
  Percent,
  Search,
  Settings,
  Star,
  Truck,
  Users,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", to: "/admin/dashboard", icon: Home },
  { title: "Products", to: "/admin/products", icon: Box },
  { title: "Categories", to: "/admin/categories", icon: Layers },
  { title: "Inventory", to: "/admin/products", icon: Truck },
  { title: "Orders", to: "/admin/orders", icon: FileText },
  { title: "Customers", to: "/admin/customers", icon: Users },
  { title: "Reviews", to: "/admin/reviews", icon: Star },
  { title: "Promotions", to: "/admin/promotions", icon: Percent },
  { title: "Blog", to: "/admin/blog", icon: FileText },
  { title: "SEO", to: "/admin/seo", icon: Search },
  { title: "Media Library", to: "/admin/media", icon: ImagePlus },
  { title: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const hideShell = pathname === "/admin/login";

  useEffect(() => {
    if (hideShell) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function checkAdmin() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session?.user?.id) {
        navigate("/admin/login");
        return;
      }
      const { data: profile, error } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      if (!mounted) return;
      if (error || !profile?.role) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setAuthorized(true);
      setLoading(false);
    }

    checkAdmin();
    return () => {
      mounted = false;
    };
  }, [hideShell, navigate]);

  const activePath = useMemo(() => pathname, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (hideShell) {
    return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="grid min-h-screen place-items-center px-4 py-20">
          <div className="rounded-3xl border border-border bg-white p-12 text-center shadow-lg">
            <p className="text-sm font-medium text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-80 shrink-0 flex-col border-r border-border bg-slate-950 text-slate-100 lg:flex">
          <div className="flex h-20 items-center px-6 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">FindHive Admin</p>
              <p className="mt-2 text-xl font-semibold">Dashboard</p>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = activePath === item.to || activePath.startsWith(`${item.to}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive ? "bg-primary text-primary-foreground" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">F</Avatar>
              <div>
                <p className="text-sm font-semibold">FindHive Team</p>
                <p className="text-xs text-slate-400">Admin console access</p>
              </div>
            </div>
            <Button onClick={handleLogout} className="mt-4 w-full" variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-border bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administration</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Store operating system</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-10" placeholder="Search orders, products, customers" aria-label="Search admin" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Notifications <Badge className="ml-2">3</Badge>
                  </Button>
                  <Button variant="secondary" size="sm">
                    Quick action
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden p-4 sm:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
