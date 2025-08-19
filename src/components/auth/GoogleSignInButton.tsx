'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function GoogleSignInButton() {
  const { signInWithGoogle, loading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign in error:', error);
        alert('로그인 중 오류가 발생했습니다: ' + error.message);
      }
      // 성공 시 리다이렉트는 Supabase가 자동으로 처리
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleGoogleSignIn}
      disabled={loading || isLoading}
      className="w-full flex items-center justify-center px-6 py-3 border border-bright-yellow/50 rounded-2xl bg-bright-yellow/90 backdrop-blur-sm text-dark-blue font-semibold hover:bg-bright-yellow hover:border-bright-yellow shadow-lg hover:shadow-bright-yellow/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {(loading || isLoading) ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-dark-blue border-t-transparent rounded-full animate-spin" />
          <span>로그인 중...</span>
        </div>
      ) : (
        <>
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#3338A0"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#3338A0"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#3338A0"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#3338A0"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 계속하기
        </>
      )}
    </motion.button>
  );
}