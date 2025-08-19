import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Supabase 환경 변수
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// 타입이 적용된 Supabase 클라이언트 생성
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Auth helper functions
export const auth = supabase.auth;

// Google OAuth 로그인
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  return { data, error };
};

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 현재 사용자 세션 가져오기
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// 프로필 생성/업데이트
export const upsertProfile = async (userId: string, profile: Partial<Database['public']['Tables']['profiles']['Insert']>) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
};