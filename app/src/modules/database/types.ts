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
      organisation: {
        Row: {
          contact_link: string | null
          created_at: string
          display_name: string
          id: string
          slug: string
          updated_at: string
        }
        Insert: {
          contact_link?: string | null
          created_at?: string
          display_name: string
          id?: string
          slug: string
          updated_at?: string
        }
        Update: {
          contact_link?: string | null
          created_at?: string
          display_name?: string
          id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      organisation_profile: {
        Row: {
          created_at: string
          organisation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organisation_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          organisation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_organisation_profile_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_organisation_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profile: {
        Row: {
          created_at: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      test: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_organisation_profile_on_signup:
        | {
            Args: {
              user_id_input: string
              profile_name_input: string
              organisation_display_name_input: string
              organisation_slug_input: string
            }
            Returns: {
              user_id: string
              organisation_id: string
              display_name: string
              slug: string
              contact_link: string
              name: string
            }[]
          }
        | {
            Args: {
              user_id_input: string
              profile_name_input: string
              organisation_id_input: string
              organisation_display_name_input: string
              organisation_slug_input: string
            }
            Returns: {
              user_id: string
              organisation_id: string
              display_name: string
              slug: string
              contact_link: string
              name: string
            }[]
          }
      test: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test1: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          user_id: string
        }[]
      }
      test2:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              created_at: string
              name: string
              updated_at: string
              user_id: string
            }[]
          }
        | {
            Args: {
              user_id_input: string
            }
            Returns: {
              created_at: string
              name: string
              updated_at: string
              user_id: string
            }[]
          }
        | {
            Args: {
              user_id_input: string
              profile_name_input: string
              organisation_display_name_input: string
              organisation_slug_input: string
            }
            Returns: {
              created_at: string
              name: string
              updated_at: string
              user_id: string
            }[]
          }
      test3: {
        Args: {
          user_id_input: string
          profile_name_input: string
          organisation_display_name_input: string
          organisation_slug_input: string
        }
        Returns: {
          contact_link: string | null
          created_at: string
          display_name: string
          id: string
          slug: string
          updated_at: string
        }[]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
