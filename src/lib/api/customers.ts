import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all customers
export const getCustomers = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get customer by ID
export const getCustomerById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create customer
export const createCustomer = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: customer, error } = await supabase
    .from('customers')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return customer
})

// Update customer
export const updateCustomer = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete customer
export const deleteCustomer = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})

// Get customer orders
export const getCustomerOrders = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { customerId } = ctx.data
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})
