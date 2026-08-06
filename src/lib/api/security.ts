import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all admin users
export const getAdminUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      roles:role_id (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get admin user by ID
export const getAdminUserById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      roles:role_id (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create admin user
export const createAdminUser = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: user, error } = await supabase
    .from('admin_users')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return user
})

// Update admin user
export const updateAdminUser = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete admin user
export const deleteAdminUser = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})

// Get all roles
export const getRoles = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
})

// Get role by ID
export const getRoleById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create role
export const createRole = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: role, error } = await supabase
    .from('roles')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return role
})

// Update role
export const updateRole = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete role
export const deleteRole = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})

// Get all permissions
export const getPermissions = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
})

// Check if user has permission
export const hasPermission = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { userId, permission } = ctx.data
  const { data, error } = await supabase.rpc('has_permission', {
    p_user_id: userId,
    p_permission: permission
  })

  if (error) throw error
  return data
})
