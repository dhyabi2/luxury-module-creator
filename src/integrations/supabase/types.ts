export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          id: number
          last_updated: string | null
          total_customers: number | null
          total_orders: number | null
          total_revenue: number | null
        }
        Insert: {
          id?: number
          last_updated?: string | null
          total_customers?: number | null
          total_orders?: number | null
          total_revenue?: number | null
        }
        Update: {
          id?: number
          last_updated?: string | null
          total_customers?: number | null
          total_orders?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      filters: {
        Row: {
          data: Json
          id: number
        }
        Insert: {
          data: Json
          id?: number
        }
        Update: {
          data?: Json
          id?: number
        }
        Relationships: []
      }
      navigation: {
        Row: {
          data: Json
          id: number
          type: string
        }
        Insert: {
          data: Json
          id?: number
          type: string
        }
        Update: {
          data?: Json
          id?: number
          type?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          customer_id: string
          id: string
          items: Json
          order_date: string | null
          status: string | null
          total: number
        }
        Insert: {
          customer_id: string
          id?: string
          items: Json
          order_date?: string | null
          status?: string | null
          total: number
        }
        Update: {
          customer_id?: string
          id?: string
          items?: Json
          order_date?: string | null
          status?: string | null
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          currency: string
          description: string | null
          discount: number | null
          id: string
          image: string
          name: string
          price: number
          rating: number
          reviews: number
          specifications: Json | null
          stock: number
        }
        Insert: {
          brand: string
          category: string
          currency: string
          description?: string | null
          discount?: number | null
          id: string
          image: string
          name: string
          price: number
          rating: number
          reviews: number
          specifications?: Json | null
          stock: number
        }
        Update: {
          brand?: string
          category?: string
          currency?: string
          description?: string | null
          discount?: number | null
          id?: string
          image?: string
          name?: string
          price?: number
          rating?: number
          reviews?: number
          specifications?: Json | null
          stock?: number
        }
        Relationships: []
      }
      sales_by_month: {
        Row: {
          amount: number
          id: number
          month: string
          year: number
        }
        Insert: {
          amount: number
          id?: number
          month: string
          year: number
        }
        Update: {
          amount?: number
          id?: number
          month?: string
          year?: number
        }
        Relationships: []
      }
      sales_stats: {
        Row: {
          average_order_value: number | null
          id: number
          total_customers: number | null
          total_orders: number | null
          total_sales: number | null
        }
        Insert: {
          average_order_value?: number | null
          id?: number
          total_customers?: number | null
          total_orders?: number | null
          total_sales?: number | null
        }
        Update: {
          average_order_value?: number | null
          id?: number
          total_customers?: number | null
          total_orders?: number | null
          total_sales?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          enable_guest_checkout: boolean | null
          enable_notifications: boolean | null
          id: number
          logo_url: string | null
          maintenance_mode: boolean | null
          store_address: string | null
          store_email: string | null
          store_name: string | null
          store_phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enable_guest_checkout?: boolean | null
          enable_notifications?: boolean | null
          id?: number
          logo_url?: string | null
          maintenance_mode?: boolean | null
          store_address?: string | null
          store_email?: string | null
          store_name?: string | null
          store_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enable_guest_checkout?: boolean | null
          enable_notifications?: boolean | null
          id?: number
          logo_url?: string | null
          maintenance_mode?: boolean | null
          store_address?: string | null
          store_email?: string | null
          store_name?: string | null
          store_phone?: string | null
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
