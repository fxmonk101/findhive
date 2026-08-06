import { supabase } from './client'

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin' | 'warehouse_staff' | 'content_manager'
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: any | null
  adminUser: AdminUser | null
  error: Error | null
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, adminUser: null, error }
  }

  if (data.user) {
    // Fetch admin user details
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (adminError) {
      return { user: data.user, adminUser: null, error: adminError }
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id)

    return { user: data.user, adminUser: adminData, error: null }
  }

  return { user: null, adminUser: null, error: new Error('No user returned') }
}

export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return { user: null, adminUser: null, error }
  }

  if (user) {
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (adminError) {
      return { user, adminUser: null, error: adminError }
    }

    return { user, adminUser: adminData, error: null }
  }

  return { user: null, adminUser: null, error: null }
}

export async function hasPermission(
  role: string,
  permission: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permissions')
    .eq('role', role)
    .single()

  if (error || !data) {
    return false
  }

  // Check if permission exists for this role
  const { data: permData } = await supabase
    .from('permissions')
    .select('*')
    .eq('name', permission)
    .single()

  return !!permData
}

export function canAccessFeature(
  userRole: string,
  requiredRole: string
): boolean {
  const roleHierarchy: Record<string, number> = {
    super_admin: 4,
    admin: 3,
    warehouse_staff: 2,
    content_manager: 2,
  }

  const userLevel = roleHierarchy[userRole] ?? 0
  const requiredLevel = roleHierarchy[requiredRole] ?? 0

  return userLevel >= requiredLevel
}
