import { createClient } from '@supabase/supabase-js';

// Development mode: Use placeholder values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          target_calories: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          target_calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          target_calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          category: 'fruit' | 'vegetable' | 'protein' | 'carb' | 'dairy' | 'snack';
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'fruit' | 'vegetable' | 'protein' | 'carb' | 'dairy' | 'snack';
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'fruit' | 'vegetable' | 'protein' | 'carb' | 'dairy' | 'snack';
          calories_per_100g?: number;
          protein_per_100g?: number;
          carbs_per_100g?: number;
          fat_per_100g?: number;
          created_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          total_calories: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          total_calories?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          total_calories?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string;
          quantity: number;
          calories: number;
        };
        Insert: {
          id?: string;
          meal_id: string;
          food_id: string;
          quantity: number;
          calories: number;
        };
        Update: {
          id?: string;
          meal_id?: string;
          food_id?: string;
          quantity?: number;
          calories?: number;
        };
      };
    };
  };
};