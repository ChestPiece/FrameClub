export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          intent: string
          message: string
          meta: Json | null
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          intent?: string
          message: string
          meta?: Json | null
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          intent?: string
          message?: string
          meta?: Json | null
          name?: string
        }
        Relationships: []
      }
      customization_options: {
        Row: {
          id: string
          label: string
          preview_url: string | null
          product_id: string | null
          swatch: string | null
          type: string
          value: string
        }
        Insert: {
          id?: string
          label: string
          preview_url?: string | null
          product_id?: string | null
          swatch?: string | null
          type: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          preview_url?: string | null
          product_id?: string | null
          swatch?: string | null
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "customization_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notify_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          product_slug: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          product_slug: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          product_slug?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_address: string
          customer_city: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customization: Json | null
          id: string
          notes: string | null
          order_number: string
          order_status: string | null
          payfast_payment_id: string | null
          payment_status: string | null
          price: number
          product_id: string | null
          product_slug: string | null
        }
        Insert: {
          created_at?: string | null
          customer_address: string
          customer_city: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customization?: Json | null
          id?: string
          notes?: string | null
          order_number: string
          order_status?: string | null
          payfast_payment_id?: string | null
          payment_status?: string | null
          price: number
          product_id?: string | null
          product_slug?: string | null
        }
        Update: {
          created_at?: string | null
          customer_address?: string
          customer_city?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customization?: Json | null
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: string | null
          payfast_payment_id?: string | null
          payment_status?: string | null
          price?: number
          product_id?: string | null
          product_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          category: string
          created_at: string | null
          delivery_days: number | null
          description: string | null
          id: string
          images: string[] | null
          name: string
          price: number
          slug: string
          specs: Json | null
          status: string | null
          years: string | null
        }
        Insert: {
          brand: string
          category?: string
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          price?: number
          slug: string
          specs?: Json | null
          status?: string | null
          years?: string | null
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          slug?: string
          specs?: Json | null
          status?: string | null
          years?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
