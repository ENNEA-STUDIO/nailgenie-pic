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
      invitations: {
        Row: {
          code: string
          created_at: string
          id: string
          used_at: string | null
          used_by: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          used_at?: string | null
          used_by?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          used_at?: string | null
          used_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_designs: {
        Row: {
          created_at: string
          id: string
          image_url: string
          nail_color: string | null
          nail_length: string | null
          nail_shape: string | null
          prompt: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_designs: {
        Row: {
          created_at: string
          id: string
          image_url: string
          nail_color: string | null
          nail_length: string | null
          nail_shape: string | null
          prompt: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_views: {
        Row: {
          created_at: string
          id: string
          image_url: string
          invite_code: string
          nail_color: string | null
          nail_length: string | null
          nail_shape: string | null
          prompt: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          invite_code: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          invite_code?: string
          nail_color?: string | null
          nail_length?: string | null
          nail_shape?: string | null
          prompt?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          credits: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_credits: {
        Args: {
          user_id_param: string
          credits_to_add: number
        }
        Returns: boolean
      }
      create_invitation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invitation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      use_credit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      use_invitation: {
        Args: {
          invitation_code: string
          new_user_id: string
        }
        Returns: boolean
      }
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
