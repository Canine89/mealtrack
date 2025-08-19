'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading, initialized, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;

    const isAuthPage = pathname.startsWith('/login');

    if (!user && !isAuthPage) {
      // 로그인하지 않은 사용자는 로그인 페이지로
      router.push('/login');
    } else if (user && isAuthPage) {
      // 로그인한 사용자는 대시보드로
      router.push('/dashboard');
    }
  }, [user, initialized, pathname, router]);

  // 초기화 중이면 로딩 화면
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white/80">MealTrack 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}