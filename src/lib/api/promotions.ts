import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all promotions
export const getPromotions = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get promotion by ID
export const getPromotionById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create promotion
export const createPromotion = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: promotion, error } = await supabase
    .from('promotions')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return promotion
})

// Update promotion
export const updatePromotion = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete promotion
export const deletePromotion = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
