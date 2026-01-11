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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points_required: number | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points_required?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points_required?: number | null
          type?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          demo_url: string | null
          description: string
          documentation_url: string | null
          downloads_count: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          long_description: string | null
          name: string
          original_price: number | null
          preview_images: string[] | null
          price: number | null
          rating: number | null
          reviews_count: number | null
          support_duration: string | null
          tech_stack: string[] | null
          updated_at: string | null
          user_id: string
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description: string
          documentation_url?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          long_description?: string | null
          name: string
          original_price?: number | null
          preview_images?: string[] | null
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
          support_duration?: string | null
          tech_stack?: string[] | null
          updated_at?: string | null
          user_id: string
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string
          documentation_url?: string | null
          downloads_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          long_description?: string | null
          name?: string
          original_price?: number | null
          preview_images?: string[] | null
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
          support_duration?: string | null
          tech_stack?: string[] | null
          updated_at?: string | null
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          download_count: number | null
          id: string
          price_paid: number
          product_id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          download_count?: number | null
          id?: string
          price_paid: number
          product_id: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          download_count?: number | null
          id?: string
          price_paid?: number
          product_id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tribe_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          tribe_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          tribe_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          tribe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tribe_members_tribe_id_fkey"
            columns: ["tribe_id"]
            isOneToOne: false
            referencedRelation: "tribes"
            referencedColumns: ["id"]
          },
        ]
      }
      tribes: {
        Row: {
          avatar: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean | null
          members_count: number | null
          name: string
          posts_count: number | null
          slug: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          members_count?: number | null
          name: string
          posts_count?: number | null
          slug: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          members_count?: number | null
          name?: string
          posts_count?: number | null
          slug?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
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
