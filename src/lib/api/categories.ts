import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all categories
export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
})

// Get categoryby ID
export const getCategoryById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create category
export const createCategory = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: category, error } = await supabase
    .from('categories')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return category
})

// Update category
export const updateCategory = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete category
export const deleteCategory = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
