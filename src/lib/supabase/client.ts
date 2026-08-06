import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'super_admin' | 'admin' | 'warehouse_staff' | 'content_manager'
          avatar_url: string | null
          phone: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'warehouse_staff' | 'content_manager'
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'warehouse_staff' | 'content_manager'
          avatar_url?: string | null
          phone?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          category: string
          subcategory: string
          price: number
          original_price: number | null
          image_url: string
          rating: number
          review_count: number
          source_retailer: string
          source_url: string
          description: string | null
          created_at: string
          sku: string | null
          barcode: string | null
          brand: string | null
          product_type: string | null
          tags: string[] | null
          cost_price: number | null
          discount_price: number | null
          tax_rate: number
          weight: number | null
          dimensions: string | null
          is_active: boolean
          is_featured: boolean
          short_description: string | null
          specifications: any
          features: string[] | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          url_slug: string | null
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          banner_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          is_visible: boolean
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          status: string
          payment_status: string
          subtotal: number
          tax: number
          shipping: number
          discount: number
          total: number
          currency: string
          payment_method: string | null
          coupon_code: string | null
          notes: string | null
          internal_notes: string | null
          shipping_address: any
          billing_address: any
          created_at: string
          updated_at: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          avatar_url: string | null
          customer_tags: string[] | null
          notes: string | null
          lifetime_spending: number
          total_orders: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          quantity: number
          warehouse_location: string | null
          minimum_stock_alert: number
          inventory_status: string
          last_counted_at: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
