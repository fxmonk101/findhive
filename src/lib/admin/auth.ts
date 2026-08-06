import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "super_admin" | "admin";

export type AdminContext = {
  userId: string;
  email: string;
  roles: AdminRole[];
  isSuperAdmin: boolean;
};

/** Returns the admin context for the current session, or null when the user is not an admin. */
export async function getAdminContext(): Promise<AdminContext | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  const roles = (roleRows ?? []).map((r) => r.role as AdminRole);
  if (roles.length === 0) return null;

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    roles,
    isSuperAdmin: roles.includes("super_admin"),
  };
}

export async function adminSignIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw new Error(error.message);

  const ctx = await getAdminContext();
  if (!ctx) {
    await supabase.auth.signOut();
    throw new Error("This account does not have admin access.");
  }
  return ctx;
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}