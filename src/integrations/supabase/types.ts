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
      project_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_contributions: {
        Row: {
          amount: number
          contributor_username: string
          created_at: string
          id: string
          message: string | null
          project_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          contributor_username: string
          created_at?: string
          id?: string
          message?: string | null
          project_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          contributor_username?: string
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_followers: {
        Row: {
          created_at: string
          id: string
          project_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_followers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          content: string
          created_at: string
          creator_username: string
          id: string
          project_id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          creator_username: string
          id?: string
          project_id: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          creator_username?: string
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          additional_media: Json | null
          category: string
          cover_image: string | null
          created_at: string
          creator_username: string
          current_funding: number
          description: string
          funding_goal: number
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          milestones: Json | null
          social_links: Json | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_media?: Json | null
          category: string
          cover_image?: string | null
          created_at?: string
          creator_username: string
          current_funding?: number
          description: string
          funding_goal: number
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          milestones?: Json | null
          social_links?: Json | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_media?: Json | null
          category?: string
          cover_image?: string | null
          created_at?: string
          creator_username?: string
          current_funding?: number
          description?: string
          funding_goal?: number
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          milestones?: Json | null
          social_links?: Json | null
          status?: string
          title?: string
          updated_at?: string
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
