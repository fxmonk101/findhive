import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all orders
export const getOrders = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (*),
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get order by ID
export const getOrderById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (*),
      order_items (*),
      shipments (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create order
export const createOrder = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: order, error } = await supabase
    .from('orders')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return order
})

// Update order
export const updateOrder = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Update order status
export const updateOrderStatus = createServerFn({
  method: 'PATCH',
}).handler(async (ctx) => {
  const { id, status } = ctx.data
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete order
export const deleteOrder = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
