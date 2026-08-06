import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all products
export const getProducts = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get product by ID
export const getProductById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create product
export const createProduct = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: product, error } = await supabase
    .from('products')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return product
})

// Update product
export const updateProduct = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete product
export const deleteProduct = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
