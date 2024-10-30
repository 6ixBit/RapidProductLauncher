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
      account_delete_tokens: {
        Row: {
          token: string
          user_id: string
        }
        Insert: {
          token?: string
          user_id: string
        }
        Update: {
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_delete_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_creatives: {
        Row: {
          ad_description: string
          ad_sub_heading: string | null
          created_at: string
          html_template_id: string
          id: number
          platform: string
        }
        Insert: {
          ad_description: string
          ad_sub_heading?: string | null
          created_at?: string
          html_template_id: string
          id?: never
          platform: string
        }
        Update: {
          ad_description?: string
          ad_sub_heading?: string | null
          created_at?: string
          html_template_id?: string
          id?: never
          platform?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_creatives_html_template_id_fkey"
            columns: ["html_template_id"]
            isOneToOne: false
            referencedRelation: "html_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          organization_id: string
          stripe_customer_id: string
        }
        Insert: {
          organization_id: string
          stripe_customer_id: string
        }
        Update: {
          organization_id?: string
          stripe_customer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      html_templates: {
        Row: {
          created_at: string
          html_code: string
          id: string
          image_urls: string[] | null
          is_imported_to_shopify: boolean
          shopify_store_id: number | null
          language: string | null
          organization_id: string
          product_description: string | null
          product_key_points: string[] | null
          product_price: string | null
          product_reviews: Json | null
          product_sub_heading: string | null
          product_title: string | null
          source_url: string
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          html_code: string
          id?: string
          image_urls?: string[] | null
          is_imported_to_shopify?: boolean
          shopify_store_id?: number | null
          language?: string | null
          organization_id: string
          product_description?: string | null
          product_key_points?: string[] | null
          product_price?: string | null
          product_reviews?: Json | null
          product_sub_heading?: string | null
          product_title?: string | null
          source_url: string
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          html_code?: string
          id?: string
          image_urls?: string[] | null
          is_imported_to_shopify?: boolean
          shopify_store_id?: number | null
          language?: string | null
          organization_id?: string
          product_description?: string | null
          product_key_points?: string[] | null
          product_price?: string | null
          product_reviews?: Json | null
          product_sub_heading?: string | null
          product_title?: string | null
          source_url?: string
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "html_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "html_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "html_templates_shopify_store_id_fkey"
            columns: ["shopify_store_id"]
            isOneToOne: false
            referencedRelation: "shopify_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_join_invitations: {
        Row: {
          created_at: string
          id: string
          invitee_organization_role: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email: string
          invitee_user_id: string | null
          inviter_user_id: string
          organization_id: string
          status: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          invitee_organization_role?: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email: string
          invitee_user_id?: string | null
          inviter_user_id: string
          organization_id: string
          status?: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Update: {
          created_at?: string
          id?: string
          invitee_organization_role?: Database["public"]["Enums"]["organization_member_role"]
          invitee_user_email?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["organization_join_invitation_link_status"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_join_invitations_invitee_user_id_fkey"
            columns: ["invitee_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_join_invitations_inviter_user_id_fkey"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_join_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: number
          member_id: string
          member_role: Database["public"]["Enums"]["organization_member_role"]
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          member_id: string
          member_role: Database["public"]["Enums"]["organization_member_role"]
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: number
          member_id?: string
          member_role?: Database["public"]["Enums"]["organization_member_role"]
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      organizations_private_info: {
        Row: {
          billing_address: Json | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          billing_address?: Json | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          billing_address?: Json | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_private_info_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      shopify_integrations: {
        Row: {
          admin_api_key: string | null
          connected_at: string
          disconnected_at: string | null
          id: number
          is_connected: boolean
          organization_id: string
          shopify_store_url: string
          user_id: string
          myshopify_domain: string
        }
        Insert: {
          admin_api_key?: string | null
          connected_at?: string
          disconnected_at?: string | null
          id?: never
          is_connected?: boolean
          organization_id: string
          shopify_store_url: string
          user_id: string
          myshopify_domain: string
        }
        Update: {
          admin_api_key?: string | null
          connected_at?: string
          disconnected_at?: string | null
          id?: never
          is_connected?: boolean
          organization_id?: string
          shopify_store_url?: string
          user_id?: string
          myshopify_domain?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopify_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_private_info: {
        Row: {
          created_at: string | null
          default_organization: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          default_organization?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          default_organization?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_private_info_default_organization_fkey"
            columns: ["default_organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_admin_get_user_id_by_email: {
        Args: {
          emailarg: string
        }
        Returns: string
      }
      check_if_authenticated_user_owns_email: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      get_invited_organizations_for_user_v2: {
        Args: {
          user_id: string
          user_email: string
        }
        Returns: {
          organization_id: string
        }[]
      }
      get_organization_admin_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      get_organization_member_ids: {
        Args: {
          organization_id: string
        }
        Returns: {
          member_id: string
        }[]
      }
      get_organizations_for_user: {
        Args: {
          user_id: string
        }
        Returns: {
          organization_id: string
        }[]
      }
    }
    Enums: {
      organization_join_invitation_link_status:
        | "active"
        | "finished_accepted"
        | "finished_declined"
        | "inactive"
      organization_joining_status:
        | "invited"
        | "joinied"
        | "declined_invitation"
        | "joined"
      organization_member_role: "owner" | "admin" | "member" | "readonly"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
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
