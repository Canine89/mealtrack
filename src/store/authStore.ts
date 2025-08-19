import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { mockUser } from '@/lib/mockData';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    
    // Mock 로그인: 어떤 이메일/비밀번호든 성공
    await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
    
    if (email && password) {
      set({ user: mockUser, loading: false });
      return { error: null };
    } else {
      set({ loading: false });
      return { error: { message: '이메일과 비밀번호를 입력해주세요.' } };
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    set({ loading: true });

    // Mock 회원가입: 항상 성공
    await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션

    if (email && password && name) {
      const newUser = {
        ...mockUser,
        email,
        user_metadata: { name }
      };
      set({ user: newUser, loading: false });
      return { error: null };
    } else {
      set({ loading: false });
      return { error: { message: '모든 필드를 입력해주세요.' } };
    }
  },

  signOut: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    set({ user: null, loading: false });
  },

  initialize: async () => {
    // Mock 초기화: 로그인하지 않은 상태로 시작
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ user: null, initialized: true });
  },
}));