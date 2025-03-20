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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
