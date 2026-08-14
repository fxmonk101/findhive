import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — FindHive" },
      { name: "description", content: "Secure FindHive admin login for managing products, orders, customers, and content." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (mode === "reset") {
      if (!email) {
        toast.error("Enter your email to reset the password.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password recovery email sent.");
      }
      return;
    }

    if (!email || !password) {
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully.");
    navigate("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-md px-4">
        <Card className="border border-border bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">FindHive Admin</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Secure login</h1>
            <p className="mt-2 text-sm text-slate-600">Only authorized staff can manage products, orders, and store settings.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            {mode === "login" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <Button type="submit" className="min-w-[8rem]" disabled={loading}>
                {mode === "login" ? "Sign in" : "Send reset email"}
              </Button>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "reset" : "login")}
                className="text-sm text-slate-600 underline-offset-4 transition hover:text-slate-900"
              >
                {mode === "login" ? "Forgot password?" : "Back to login"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            Admin sign in is protected by Supabase Authentication. Regular shoppers cannot access this area.
          </p>
        </Card>
      </div>
    </div>
  );
}
