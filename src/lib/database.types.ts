export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      app_admins: {
        Row: {
          role: Database["public"]["Enums"]["app_admin_role"] | null
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["app_admin_role"] | null
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_admin_role"] | null
          user_id?: string
        }
      }
      app_settings: {
        Row: {
          id: number
          maintenance_message: string | null
          maintenance_status:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at: string | null
        }
        Insert: {
          id?: number
          maintenance_message?: string | null
          maintenance_status?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at?: string | null
        }
        Update: {
          id?: number
          maintenance_message?: string | null
          maintenance_status?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
          scheduled_maintenance_ends_at?: string | null
        }
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
      }
      organization_credits: {
        Row: {
          credits: number
          organization_id: string
        }
        Insert: {
          credits?: number
          organization_id: string
        }
        Update: {
          credits?: number
          organization_id?: string
        }
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
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          title?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          title?: string
        }
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
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          project_status: Database["public"]["Enums"]["project_status"]
          team_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          project_status?: Database["public"]["Enums"]["project_status"]
          team_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          project_status?: Database["public"]["Enums"]["project_status"]
          team_id?: number
          updated_at?: string
        }
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
      }
      team_members: {
        Row: {
          created_at: string | null
          id: number
          role: Database["public"]["Enums"]["project_team_member_role"]
          team_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          role?: Database["public"]["Enums"]["project_team_member_role"]
          team_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          role?: Database["public"]["Enums"]["project_team_member_role"]
          team_id?: number
          user_id?: string
        }
      }
      teams: {
        Row: {
          created_at: string | null
          id: number
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          organization_id?: string
        }
      }
      user_private_info: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
      }
    }
    Views: {
      app_admin_all_users: {
        Row: {
          avatar_url: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_app_admin: boolean | null
          is_confirmed: boolean | null
          last_sign_in_at: string | null
          updated_at: string | null
        }
      }
    }
    Functions: {
      app_admin_get_all_organizations: {
        Args: {
          search_query?: string
          page?: number
          page_size?: number
        }
        Returns: {
          id: string
          created_at: string
          title: string
          team_members_count: number
          owner_full_name: string
          owner_email: string
          credits: number
        }[]
      }
      app_admin_get_all_users: {
        Args: {
          search_query?: string
          page?: number
          page_size?: number
        }
        Returns: {
          id: string
          email: string
          created_at: string
          updated_at: string
          full_name: string
          avatar_url: string
          is_app_admin: boolean
          confirmed_at: string
          is_confirmed: boolean
          last_sign_in_at: string
        }[]
      }
      app_admin_get_organizations_created_per_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          number_of_organizations: number
        }[]
      }
      app_admin_get_projects_created_per_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          number_of_projects: number
        }[]
      }
      app_admin_get_recent_30_day_signin_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      app_admin_get_total_organization_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      app_admin_get_total_project_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      app_admin_get_total_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      app_admin_get_users_created_per_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          number_of_users: number
        }[]
      }
      check_if_authenticated_user_owns_email: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      check_if_user_is_app_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      decrement_credits: {
        Args: {
          org_id: string
          amount: number
        }
        Returns: undefined
      }
      disable_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enable_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      get_organization_id_by_team_id:
        | {
            Args: {
              p_id: number
            }
            Returns: string
          }
        | {
            Args: {
              p_id: number
            }
            Returns: string
          }
      get_organization_id_for_project_id: {
        Args: {
          project_id: string
        }
        Returns: string
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
      get_team_admins_by_team_id: {
        Args: {
          team_id: number
        }
        Returns: {
          user_id: string
        }[]
      }
      get_team_id_for_project_id: {
        Args: {
          project_id: string
        }
        Returns: number
      }
      get_team_members_team_id: {
        Args: {
          team_id: number
        }
        Returns: {
          user_id: string
        }[]
      }
      increment_credits: {
        Args: {
          org_id: string
          amount: number
        }
        Returns: undefined
      }
      is_app_in_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_app_not_in_maintenance_mode: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      make_user_app_admin: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      remove_app_admin_privilege_for_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_admin_role: "moderator" | "admin" | "super_admin"
      maintenance_status: "inactive" | "active" | "scheduled"
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
      project_status: "draft" | "pending_approval" | "approved" | "completed"
      project_team_member_role: "admin" | "member" | "readonly"
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
