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
      inventory_item: {
        Row: {
          created_at: string
          id: string
          item_id: string
          profile_id: string | null
          status: Database["public"]["Enums"]["inventory_item_status"]
          store_id: string
          tags: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"]
          store_id?: string
          tags?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["inventory_item_status"]
          store_id?: string
          tags?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_inventory_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_inventory_item_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_inventory_item_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          }
        ]
      }
      item: {
        Row: {
          created_at: string
          id: string
          tags: Json
        }
        Insert: {
          created_at?: string
          id?: string
          tags?: Json
        }
        Update: {
          created_at?: string
          id?: string
          tags?: Json
        }
        Relationships: []
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
      store: {
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
      store_profile: {
        Row: {
          created_at: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          store_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_organisation_profile_organisation_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
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
      insert_store_profile_on_signup: {
        Args: {
          user_id_input: string
          profile_name_input: string
          store_id_input: string
          store_display_name_input: string
          store_slug_input: string
        }
        Returns: {
          user_id: string
          store_id: string
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
      inventory_item_status: "available" | "pending" | "sold" | "draft"
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
