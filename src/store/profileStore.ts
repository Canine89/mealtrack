import { create } from 'zustand';
import { UserProfile, ProfileUpdateData } from '@/types';
import { getUserProfile, updateUserProfile, createUserProfile, checkProfileExists } from '@/lib/api/profiles';

interface ProfileStore {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: ProfileUpdateData) => Promise<boolean>;
  createProfile: (userId: string, email: string, fullName?: string) => Promise<boolean>;
  ensureProfile: (userId: string, email: string, fullName?: string) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const profile = await getUserProfile(userId);
      set({ profile, loading: false });
    } catch {
      set({ 
        error: '프로필을 불러오는데 실패했습니다.', 
        loading: false 
      });
    }
  },

  updateProfile: async (userId: string, updates: ProfileUpdateData) => {
    set({ loading: true, error: null });
    
    try {
      const updatedProfile = await updateUserProfile(userId, updates);
      
      if (updatedProfile) {
        set({ profile: updatedProfile, loading: false });
        return true;
      } else {
        set({ 
          error: '프로필 업데이트에 실패했습니다.', 
          loading: false 
        });
        return false;
      }
    } catch {
      set({ 
        error: '프로필 업데이트 중 오류가 발생했습니다.', 
        loading: false 
      });
      return false;
    }
  },

  createProfile: async (userId: string, email: string, fullName?: string) => {
    set({ loading: true, error: null });
    
    try {
      const newProfile = await createUserProfile(userId, email, fullName);
      
      if (newProfile) {
        set({ profile: newProfile, loading: false });
        return true;
      } else {
        set({ 
          error: '프로필 생성에 실패했습니다.', 
          loading: false 
        });
        return false;
      }
    } catch {
      set({ 
        error: '프로필 생성 중 오류가 발생했습니다.', 
        loading: false 
      });
      return false;
    }
  },

  ensureProfile: async (userId: string, email: string, fullName?: string) => {
    const profileExists = await checkProfileExists(userId);
    
    if (!profileExists) {
      await get().createProfile(userId, email, fullName);
    } else {
      await get().fetchProfile(userId);
    }
  },

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
}));