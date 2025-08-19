import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, signInWithGoogle, signOut as supabaseSignOut, upsertProfile } from '@/lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  target_calories: number | null;
  height: number | null;
  weight: number | null;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  signInWithGoogle: async () => {
    set({ loading: true });
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        set({ loading: false });
        return { error };
      }

      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { error: { message: '로그인 중 오류가 발생했습니다.' } };
    }
  },

  signOut: async () => {
    set({ loading: true });
    
    try {
      const { error } = await supabaseSignOut();
      
      if (!error) {
        set({ user: null, profile: null, loading: false });
      } else {
        set({ loading: false });
      }
      
      return { error };
    } catch (error) {
      set({ loading: false });
      return { error: { message: '로그아웃 중 오류가 발생했습니다.' } };
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get();
    if (!user) {
      return { error: { message: '로그인이 필요합니다.' } };
    }

    set({ loading: true });
    
    try {
      const { data, error } = await upsertProfile(user.id, updates);
      
      if (!error && data) {
        set({ profile: data as Profile, loading: false });
      } else {
        set({ loading: false });
      }
      
      return { error };
    } catch (error) {
      set({ loading: false });
      return { error: { message: '프로필 업데이트 중 오류가 발생했습니다.' } };
    }
  },

  initialize: async () => {
    set({ loading: true });
    
    try {
      // 현재 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // 프로필 데이터 가져오기
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // 프로필이 없으면 생성
        if (!profile) {
          await upsertProfile(session.user.id, {
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            target_calories: 2000,
          });

          // 생성된 프로필 다시 가져오기
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ 
            user: session.user, 
            profile: newProfile,
            loading: false, 
            initialized: true 
          });
        } else {
          set({ 
            user: session.user, 
            profile,
            loading: false, 
            initialized: true 
          });
        }
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }

      // Auth 상태 변경 리스너 설정
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ user: session.user, profile });
        } else {
          set({ user: null, profile: null });
        }
      });

    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, profile: null, loading: false, initialized: true });
    }
  },
}));