// Generated types from Supabase
/* eslint-disable */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: { created_at: string | null; id: string; name: string; slug: string }
        Insert: { created_at?: string | null; id?: string; name: string; slug: string }
        Update: { created_at?: string | null; id?: string; name?: string; slug?: string }
        Relationships: []
      }
      conversations: {
        Row: { client_id: string; company_id: string; created_at: string | null; id: string }
        Insert: { client_id: string; company_id: string; created_at?: string | null; id?: string }
        Update: { client_id?: string; company_id?: string; created_at?: string | null; id?: string }
        Relationships: []
      }
      messages: {
        Row: { conversation_id: string | null; created_at: string | null; id: string; sender: string | null; text: string | null }
        Insert: { conversation_id?: string | null; created_at?: string | null; id?: string; sender?: string | null; text?: string | null }
        Update: { conversation_id?: string | null; created_at?: string | null; id?: string; sender?: string | null; text?: string | null }
        Relationships: []
      }
      quotes: {
        Row: { id: string; company_id: string; user_id: string; service: string; status: string; created_at: string | null }
        Insert: { id?: string; company_id: string; user_id: string; service: string; status: string; created_at?: string | null }
        Update: { id?: string; company_id?: string; user_id?: string; service?: string; status?: string; created_at?: string | null }
        Relationships: []
      }
    }
    Views: { [key: string]: never }
    Functions: {}
    Enums: { user_type: "client" | "company" }
    CompositeTypes: { [key: string]: never }
  }
}

export type PublicSchema = Database["public"]
