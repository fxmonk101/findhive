import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "super_admin" | "admin" | "warehouse_staff" | "content_manager";

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

  try {
    const { data: roleRows, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    if (roleError) {
      console.error("Error fetching user roles:", roleError);
      return null;
    }

    const roles = (roleRows ?? []).map((r) => r.role as AdminRole);
    if (roles.length === 0) return null;

    return {
      userId: data.user.id,
      email: data.user.email ?? "",
      roles,
      isSuperAdmin: roles.includes("super_admin"),
    };
  } catch (err) {
    console.error("Error in getAdminContext:", err);
    return null;
  }
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