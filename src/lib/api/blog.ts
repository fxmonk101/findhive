import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all blog posts
export const getBlogPosts = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
})

// Get blog post by ID
export const getBlogPostById = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
})

// Create blog post
export const createBlogPost = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert(ctx.data)
    .select()
    .single()

  if (error) throw error
  return post
})

// Update blog post
export const updateBlogPost = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Update blog post status
export const updateBlogPostStatus = createServerFn({
  method: 'PATCH',
}).handler(async (ctx) => {
  const { id, status } = ctx.data
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Delete blog post
export const deleteBlogPost = createServerFn({
  method: 'DELETE',
}).handler(async (ctx) => {
  const { id } = ctx.data
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
})
