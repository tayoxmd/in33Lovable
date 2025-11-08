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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_settings: {
        Row: {
          allowed_origins: string[] | null
          api_key_required: boolean | null
          created_at: string
          id: string
          rate_limit_per_minute: number | null
          updated_at: string
        }
        Insert: {
          allowed_origins?: string[] | null
          api_key_required?: boolean | null
          created_at?: string
          id?: string
          rate_limit_per_minute?: number | null
          updated_at?: string
        }
        Update: {
          allowed_origins?: string[] | null
          api_key_required?: boolean | null
          created_at?: string
          id?: string
          rate_limit_per_minute?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      backups: {
        Row: {
          backup_created_at: string
          backup_data: Json
          backup_version: string
          created_at: string
          id: string
        }
        Insert: {
          backup_created_at?: string
          backup_data: Json
          backup_version: string
          created_at?: string
          id?: string
        }
        Update: {
          backup_created_at?: string
          backup_data?: Json
          backup_version?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount_paid: number | null
          check_in: string
          check_out: string
          created_at: string
          discount_amount: number | null
          extra_beds: number | null
          extra_meals: number | null
          guests: number
          hotel_confirmation_number: string | null
          id: string
          manual_total: number | null
          notes: string | null
          payment_status: string
          room_id: string | null
          rooms: number
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          check_in: string
          check_out: string
          created_at?: string
          discount_amount?: number | null
          extra_beds?: number | null
          extra_meals?: number | null
          guests?: number
          hotel_confirmation_number?: string | null
          id?: string
          manual_total?: number | null
          notes?: string | null
          payment_status?: string
          room_id?: string | null
          rooms?: number
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          check_in?: string
          check_out?: string
          created_at?: string
          discount_amount?: number | null
          extra_beds?: number | null
          extra_meals?: number | null
          guests?: number
          hotel_confirmation_number?: string | null
          id?: string
          manual_total?: number | null
          notes?: string | null
          payment_status?: string
          room_id?: string | null
          rooms?: number
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_from_support: boolean
          message: string
          sender_id: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_from_support?: boolean
          message: string
          sender_id?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_from_support?: boolean
          message?: string
          sender_id?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          guest_id: string | null
          id: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          guest_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          guest_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          active: boolean | null
          country: string
          created_at: string
          id: string
          name: string
          name_ar: string | null
          name_en: string | null
        }
        Insert: {
          active?: boolean | null
          country: string
          created_at?: string
          id?: string
          name: string
          name_ar?: string | null
          name_en?: string | null
        }
        Update: {
          active?: boolean | null
          country?: string
          created_at?: string
          id?: string
          name?: string
          name_ar?: string | null
          name_en?: string | null
        }
        Relationships: []
      }
      guest_verifications: {
        Row: {
          booking_id: string
          created_at: string
          expires_at: string
          id: string
          otp: string
          phone: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          expires_at: string
          id?: string
          otp: string
          phone: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          otp?: string
          phone?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_verifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          name_ar: string | null
          name_en: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          name_ar?: string | null
          name_en?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          name_ar?: string | null
          name_en?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          available: boolean | null
          capacity: number
          created_at: string
          hotel_id: string | null
          id: string
          images: string[] | null
          price_per_night: number
          room_number: string
          room_type: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          available?: boolean | null
          capacity?: number
          created_at?: string
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          price_per_night: number
          room_number: string
          room_type: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          available?: boolean | null
          capacity?: number
          created_at?: string
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          price_per_night?: number
          room_number?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          admin_theme: string | null
          animation_speed_multiplier: number | null
          created_at: string
          disable_animations: boolean | null
          email: string | null
          facebook_url: string | null
          hotel_room_color: string | null
          id: string
          instagram_url: string | null
          loader_custom_css: string | null
          loader_custom_html: string | null
          loader_custom_js: string | null
          loader_enabled: boolean | null
          loader_speed_ms: number | null
          loader_type: string | null
          meal_badge_auto_width_desktop: boolean | null
          meal_badge_auto_width_mobile: boolean | null
          meal_badge_auto_width_tablet: boolean | null
          meal_badge_border_radius: string | null
          meal_badge_color: string | null
          meal_badge_font_size: string | null
          meal_badge_height_desktop: string | null
          meal_badge_height_mobile: string | null
          meal_badge_height_tablet: string | null
          meal_badge_text_color: string | null
          meal_badge_width_desktop: string | null
          meal_badge_width_mobile: string | null
          meal_badge_width_tablet: string | null
          meal_description_bg_color: string | null
          meal_description_border_color: string | null
          meal_description_border_radius: string | null
          meal_description_font_size: string | null
          meal_description_text_color: string | null
          owner_room_color: string | null
          phone: string | null
          task_visible_roles: string[] | null
          tidio_public_key: string | null
          twitter_url: string | null
          updated_at: string
          user_theme: string | null
          whatsapp_number: string | null
        }
        Insert: {
          admin_theme?: string | null
          animation_speed_multiplier?: number | null
          created_at?: string
          disable_animations?: boolean | null
          email?: string | null
          facebook_url?: string | null
          hotel_room_color?: string | null
          id?: string
          instagram_url?: string | null
          loader_custom_css?: string | null
          loader_custom_html?: string | null
          loader_custom_js?: string | null
          loader_enabled?: boolean | null
          loader_speed_ms?: number | null
          loader_type?: string | null
          meal_badge_auto_width_desktop?: boolean | null
          meal_badge_auto_width_mobile?: boolean | null
          meal_badge_auto_width_tablet?: boolean | null
          meal_badge_border_radius?: string | null
          meal_badge_color?: string | null
          meal_badge_font_size?: string | null
          meal_badge_height_desktop?: string | null
          meal_badge_height_mobile?: string | null
          meal_badge_height_tablet?: string | null
          meal_badge_text_color?: string | null
          meal_badge_width_desktop?: string | null
          meal_badge_width_mobile?: string | null
          meal_badge_width_tablet?: string | null
          meal_description_bg_color?: string | null
          meal_description_border_color?: string | null
          meal_description_border_radius?: string | null
          meal_description_font_size?: string | null
          meal_description_text_color?: string | null
          owner_room_color?: string | null
          phone?: string | null
          task_visible_roles?: string[] | null
          tidio_public_key?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_theme?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          admin_theme?: string | null
          animation_speed_multiplier?: number | null
          created_at?: string
          disable_animations?: boolean | null
          email?: string | null
          facebook_url?: string | null
          hotel_room_color?: string | null
          id?: string
          instagram_url?: string | null
          loader_custom_css?: string | null
          loader_custom_html?: string | null
          loader_custom_js?: string | null
          loader_enabled?: boolean | null
          loader_speed_ms?: number | null
          loader_type?: string | null
          meal_badge_auto_width_desktop?: boolean | null
          meal_badge_auto_width_mobile?: boolean | null
          meal_badge_auto_width_tablet?: boolean | null
          meal_badge_border_radius?: string | null
          meal_badge_color?: string | null
          meal_badge_font_size?: string | null
          meal_badge_height_desktop?: string | null
          meal_badge_height_mobile?: string | null
          meal_badge_height_tablet?: string | null
          meal_badge_text_color?: string | null
          meal_badge_width_desktop?: string | null
          meal_badge_width_mobile?: string | null
          meal_badge_width_tablet?: string | null
          meal_description_bg_color?: string | null
          meal_description_border_color?: string | null
          meal_description_border_radius?: string | null
          meal_description_font_size?: string | null
          meal_description_text_color?: string | null
          owner_room_color?: string | null
          phone?: string | null
          task_visible_roles?: string[] | null
          tidio_public_key?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_theme?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      task_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          task_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          task_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          task_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name_ar: string
          name_en: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category_id: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          order_index: number
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_task_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_hotels: {
        Args: { p_active_only?: boolean; p_city_id?: string }
        Returns: {
          address: string | null
          amenities: string[] | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          name_ar: string | null
          name_en: string | null
          rating: number | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "hotels"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_site_settings: {
        Args: never
        Returns: {
          admin_theme: string | null
          animation_speed_multiplier: number | null
          created_at: string
          disable_animations: boolean | null
          email: string | null
          facebook_url: string | null
          hotel_room_color: string | null
          id: string
          instagram_url: string | null
          loader_custom_css: string | null
          loader_custom_html: string | null
          loader_custom_js: string | null
          loader_enabled: boolean | null
          loader_speed_ms: number | null
          loader_type: string | null
          meal_badge_auto_width_desktop: boolean | null
          meal_badge_auto_width_mobile: boolean | null
          meal_badge_auto_width_tablet: boolean | null
          meal_badge_border_radius: string | null
          meal_badge_color: string | null
          meal_badge_font_size: string | null
          meal_badge_height_desktop: string | null
          meal_badge_height_mobile: string | null
          meal_badge_height_tablet: string | null
          meal_badge_text_color: string | null
          meal_badge_width_desktop: string | null
          meal_badge_width_mobile: string | null
          meal_badge_width_tablet: string | null
          meal_description_bg_color: string | null
          meal_description_border_color: string | null
          meal_description_border_radius: string | null
          meal_description_font_size: string | null
          meal_description_text_color: string | null
          owner_room_color: string | null
          phone: string | null
          task_visible_roles: string[] | null
          tidio_public_key: string | null
          twitter_url: string | null
          updated_at: string
          user_theme: string | null
          whatsapp_number: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "site_settings"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee" | "company" | "customer"
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
    Enums: {
      app_role: ["admin", "manager", "employee", "company", "customer"],
    },
  },
} as const
