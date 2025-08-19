import { supabase } from '@/lib/supabase';
import { UserProfile, ProfileUpdateData } from '@/types';

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('프로필 조회 오류:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('프로필 조회 중 오류 발생:', error);
    return null;
  }
}

/**
 * 사용자 프로필 생성 (회원가입 시)
 */
export async function createUserProfile(
  userId: string, 
  email: string, 
  fullName?: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          target_calories: 2000,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('프로필 생성 오류:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('프로필 생성 중 오류 발생:', error);
    return null;
  }
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(
  userId: string, 
  updates: ProfileUpdateData
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('프로필 업데이트 오류:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    return null;
  }
}

/**
 * 사용자 프로필 존재 여부 확인
 */
export async function checkProfileExists(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116은 "not found" 에러
      console.error('프로필 존재 확인 오류:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('프로필 존재 확인 중 오류 발생:', error);
    return false;
  }
}