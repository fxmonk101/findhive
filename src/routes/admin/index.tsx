import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "FindHive Admin — Dashboard" },
      { name: "description", content: "Secure admin login and dashboard for FindHive operations." },
    ],
  }),
  component: AdminIndex,
});

function AdminIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  return (
    <AdminShell>
      <div className="grid place-items-center min-h-[calc(100vh-6rem)]">
        <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">Redirecting to the admin dashboard…</p>
        </div>
      </div>
    </AdminShell>
  );
}
