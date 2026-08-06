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
      admin_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          previous_value: Json | null
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_id: string | null
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_id?: string | null
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: string | null
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          billing_address: Json
          created_at: string
          email: string
          full_name: string | null
          id: string
          notes: string | null
          phone: string | null
          shipping_address: Json
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: Json
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          shipping_address?: Json
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          change: number
          changed_by: string | null
          changed_by_email: string | null
          created_at: string
          id: string
          new_stock: number
          previous_stock: number | null
          product_id: string
          reason: string | null
        }
        Insert: {
          change?: number
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_stock: number
          previous_stock?: number | null
          product_id: string
          reason?: string | null
        }
        Update: {
          change?: number
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_stock?: number
          previous_stock?: number | null
          product_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          bucket: string
          created_at: string
          file_name: string | null
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_name?: string | null
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_name?: string | null
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          discount: number
          id: string
          image_url: string | null
          line_total: number
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          title: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          discount?: number
          id?: string
          image_url?: string | null
          line_total?: number
          order_id: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          title: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          discount?: number
          id?: string
          image_url?: string | null
          line_total?: number
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          title?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          changed_by_email: string | null
          created_at: string
          id: string
          new_status: string
          note: string | null
          order_id: string
          previous_status: string | null
        }
        Insert: {
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_status: string
          note?: string | null
          order_id: string
          previous_status?: string | null
        }
        Update: {
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          new_status?: string
          note?: string | null
          order_id?: string
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          created_at: string
          currency: string
          customer_email: string
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_total: number
          id: string
          internal_notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string
          shipping_address: Json
          shipping_method: string | null
          shipping_status: string
          shipping_total: number
          status: string
          subtotal: number
          tax_total: number
          total: number
          tracking_number: string | null
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json
          created_at?: string
          currency?: string
          customer_email: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          id?: string
          internal_notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json
          shipping_method?: string | null
          shipping_status?: string
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          tracking_number?: string | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json
          created_at?: string
          currency?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          id?: string
          internal_notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json
          shipping_method?: string | null
          shipping_status?: string
          shipping_total?: number
          status?: string
          subtotal?: number
          tax_total?: number
          total?: number
          tracking_number?: string | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          position: number
          product_id: string
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id: string
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          featured: boolean
          id: string
          product_id: string
          rating: number
          review_type: string
          status: string
          title: string
          verified_purchase: boolean
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          featured?: boolean
          id?: string
          product_id: string
          rating: number
          review_type?: string
          status?: string
          title: string
          verified_purchase?: boolean
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          featured?: boolean
          id?: string
          product_id?: string
          rating?: number
          review_type?: string
          status?: string
          title?: string
          verified_purchase?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          brand: string | null
          canonical_url: string | null
          category: string
          cost_price: number | null
          created_at: string
          description: string | null
          focus_keyword: string | null
          id: string
          image_alt: string | null
          image_url: string
          images: Json
          long_description: string | null
          low_stock_threshold: number
          meta_description: string | null
          meta_title: string | null
          original_price: number | null
          pokemon: Json
          price: number
          rating: number
          related_keywords: string[]
          review_count: number
          short_description: string | null
          sku: string | null
          slug: string | null
          sold_count: number
          source_retailer: string
          source_url: string
          status: string
          stock_count: number
          subcategory: string
          tags: string[]
          title: string
          updated_at: string
          viewer_count: number
        }
        Insert: {
          attributes?: Json
          brand?: string | null
          canonical_url?: string | null
          category: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          focus_keyword?: string | null
          id?: string
          image_alt?: string | null
          image_url: string
          images?: Json
          long_description?: string | null
          low_stock_threshold?: number
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          pokemon?: Json
          price: number
          rating?: number
          related_keywords?: string[]
          review_count?: number
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          sold_count?: number
          source_retailer: string
          source_url: string
          status?: string
          stock_count?: number
          subcategory: string
          tags?: string[]
          title: string
          updated_at?: string
          viewer_count?: number
        }
        Update: {
          attributes?: Json
          brand?: string | null
          canonical_url?: string | null
          category?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          focus_keyword?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string
          images?: Json
          long_description?: string | null
          low_stock_threshold?: number
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          pokemon?: Json
          price?: number
          rating?: number
          related_keywords?: string[]
          review_count?: number
          short_description?: string | null
          sku?: string | null
          slug?: string | null
          sold_count?: number
          source_retailer?: string
          source_url?: string
          status?: string
          stock_count?: number
          subcategory?: string
          tags?: string[]
          title?: string
          updated_at?: string
          viewer_count?: number
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          min_order_total: number | null
          starts_at: string | null
          target_category: string | null
          target_product_id: string | null
          updated_at: string
          usage_count: number
          usage_limit: number | null
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          min_order_total?: number | null
          starts_at?: string | null
          target_category?: string | null
          target_product_id?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          min_order_total?: number | null
          starts_at?: string | null
          target_category?: string | null
          target_product_id?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          featured: boolean
          id: string
          rating: number
          status: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          featured?: boolean
          id?: string
          rating: number
          status?: string
          title: string
          topic?: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          featured?: boolean
          id?: string
          rating?: number
          status?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "super_admin" | "admin"
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
    Enums: {
      app_role: ["super_admin", "admin"],
    },
  },
} as const
