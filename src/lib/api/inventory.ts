import { createServerFn } from '@tanstack/start'
import { supabase } from '@/lib/supabase/client'

// Get all inventory items
export const getInventory = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products:product_id (*),
      warehouses:warehouse_id (*)
    `)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
})

// Get inventory by product ID
export const getInventoryByProduct = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const { productId } = ctx.data
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('product_id', productId)

  if (error) throw error
  return data
})

// Update inventory quantity
export const updateInventory = createServerFn({
  method: 'PUT',
}).handler(async (ctx) => {
  const { id, ...updates } = ctx.data
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
})

// Adjust inventory (add/remove stock)
export const adjustInventory = createServerFn({
  method: 'POST',
}).handler(async (ctx) => {
  const { productId, warehouseId, quantity, adjustmentType } = ctx.data
  
  const { data, error } = await supabase.rpc('adjust_inventory', {
    p_product_id: productId,
    p_warehouse_id: warehouseId,
    p_quantity: quantity,
    p_adjustment_type: adjustmentType
  })

  if (error) throw error
  return data
})

// Get low stock items
export const getLowStockItems = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      products:product_id (*)
    `)
    .lt('quantity', 10)
    .order('quantity', { ascending: true })

  if (error) throw error
  return data
})
