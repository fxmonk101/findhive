import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all reviews
export const getReviews = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get review by ID
export const getReviewById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Update review status (approve/reject)
export const updateReviewStatus = createServerFn({
  method: 'PATCH',
}).handler(async (ctx) => {
  const { id, status } = ctx.data
  const { data, error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Reply to review
export const replyToReview = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { id, reply } = ctx.data
  const { data, error } = await supabase
    .from('reviews')
    .update({ reply })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete review
export const deleteReview = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
