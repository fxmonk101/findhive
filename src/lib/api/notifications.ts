import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all notifications
export const getNotifications = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get notification by ID
export const getNotificationById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create notification
export const createNotification = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return notification
})

// Mark notification as read
export const markNotificationAsRead = createServerFn({
  method: 'PATCH',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete notification
export const deleteNotification = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
