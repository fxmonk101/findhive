export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          user_id: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          image_url: string | null
          seo_title: string | null
          meta_description: string | null
          canonical_url: string | null
          subcategories: Json
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          image_url?: string | null
          seo_title?: string | null
          meta_description?: string | null
          canonical_url?: string | null
          subcategories?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          image_url?: string | null
          seo_title?: string | null
          meta_description?: string | null
          canonical_url?: string | null
          subcategories?: Json
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          title: string | null
          caption: string | null
          is_main: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          title?: string | null
          caption?: string | null
          is_main?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          title?: string | null
          caption?: string | null
          is_main?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          billing_address: Json | null
          shipping_address: Json | null
          metadata: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          products: Json
          subtotal: number
          shipping: number
          taxes: number
          discounts: number
          total: number
          payment_method: string | null
          payment_status: string
          transaction_reference: string | null
          shipping_method: string | null
          tracking_number: string | null
          order_status: string
          shipping_status: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id?: string | null
          products?: Json
          subtotal?: number
          shipping?: number
          taxes?: number
          discounts?: number
          total?: number
          payment_method?: string | null
          payment_status?: string
          transaction_reference?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          order_status?: string
          shipping_status?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          products?: Json
          subtotal?: number
          shipping?: number
          taxes?: number
          discounts?: number
          total?: number
          payment_method?: string | null
          payment_status?: string
          transaction_reference?: string | null
          shipping_method?: string | null
          tracking_number?: string | null
          order_status?: string
          shipping_status?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          previous_status: string
          next_status: string
          changed_by: string | null
          note: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          order_id: string
          previous_status: string
          next_status: string
          changed_by?: string | null
          note?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          previous_status?: string
          next_status?: string
          changed_by?: string | null
          note?: string | null
          changed_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          method: string | null
          status: string
          amount: number
          currency: string
          provider_reference: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          method?: string | null
          status?: string
          amount?: number
          currency?: string
          provider_reference?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          method?: string | null
          status?: string
          amount?: number
          currency?: string
          provider_reference?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          product_id: string | null
          customer_id: string | null
          rating: number
          title: string | null
          body: string | null
          status: string
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          customer_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          status?: string
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          customer_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          status?: string
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          discount_amount: number | null
          discount_percent: number | null
          applies_to_products: Json
          applies_to_categories: Json
          start_date: string | null
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          discount_amount?: number | null
          discount_percent?: number | null
          applies_to_products?: Json
          applies_to_categories?: Json
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          discount_amount?: number | null
          discount_percent?: number | null
          applies_to_products?: Json
          applies_to_categories?: Json
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          usage_limit: number | null
          used_count: number
          starts_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          usage_limit?: number | null
          used_count?: number
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          usage_limit?: number | null
          used_count?: number
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          body: string | null
          author: string | null
          category: string | null
          tags: string[]
          featured_image: string | null
          seo_title: string | null
          meta_description: string | null
          focus_keyword: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          body?: string | null
          author?: string | null
          category?: string | null
          tags?: string[]
          featured_image?: string | null
          seo_title?: string | null
          meta_description?: string | null
          focus_keyword?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          body?: string | null
          author?: string | null
          category?: string | null
          tags?: string[]
          featured_image?: string | null
          seo_title?: string | null
          meta_description?: string | null
          focus_keyword?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          id: string
          entity_type: string
          entity_id: string | null
          title: string | null
          description: string | null
          focus_keyword: string | null
          related_keywords: string[]
          canonical_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id?: string | null
          title?: string | null
          description?: string | null
          focus_keyword?: string | null
          related_keywords?: string[]
          canonical_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string | null
          title?: string | null
          description?: string | null
          focus_keyword?: string | null
          related_keywords?: string[]
          canonical_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          id: string
          bucket: string
          path: string
          url: string
          alt_text: string | null
          title: string | null
          caption: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bucket: string
          path: string
          url: string
          alt_text?: string | null
          title?: string | null
          caption?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bucket?: string
          path?: string
          url?: string
          alt_text?: string | null
          title?: string | null
          caption?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          type: string
          title: string
          body: string | null
          is_read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          body?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string
          body?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          admin_user: string | null
          action: string
          object_type: string
          object_id: string | null
          previous_value: Json | null
          new_value: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user?: string | null
          action: string
          object_type: string
          object_id?: string | null
          previous_value?: Json | null
          new_value?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user?: string | null
          action?: string
          object_type?: string
          object_id?: string | null
          previous_value?: Json | null
          new_value?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          id: string
          store_name: string
          logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          currency: string
          timezone: string
          homepage_title: string | null
          homepage_meta_description: string | null
          robots_text: string | null
          sitemap_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_name?: string
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          currency?: string
          timezone?: string
          homepage_title?: string | null
          homepage_meta_description?: string | null
          robots_text?: string | null
          sitemap_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_name?: string
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          currency?: string
          timezone?: string
          homepage_title?: string | null
          homepage_meta_description?: string | null
          robots_text?: string | null
          sitemap_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          attributes: Json
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          images: Json
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          original_price: number | null
          price: number
          rating: number
          review_count: number
          short_description: string | null
          sold_count: number
          source_retailer: string
          source_url: string
          stock_count: number
          subcategory: string
          title: string
          viewer_count: number
        }
        Insert: {
          attributes?: Json
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          images?: Json
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          price: number
          rating?: number
          review_count?: number
          short_description?: string | null
          sold_count?: number
          source_retailer: string
          source_url: string
          stock_count?: number
          subcategory: string
          title: string
          viewer_count?: number
        }
        Update: {
          attributes?: Json
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          images?: Json
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          price?: number
          rating?: number
          review_count?: number
          short_description?: string | null
          sold_count?: number
          source_retailer?: string
          source_url?: string
          stock_count?: number
          subcategory?: string
          title?: string
          viewer_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
