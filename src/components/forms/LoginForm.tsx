'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [error, setError] = useState('');

  const { signInWithGoogle, loading } = useAuthStore();

  const handleGoogleLogin = async () => {
    setError('');
    const { error: signInError } = await signInWithGoogle();
    
    if (signInError) {
      setError('Google 로그인에 실패했습니다.');
    }
  };

  return (
    <Card glassEffect="medium" className="p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">로그인</h2>
        <p className="text-white/70">MealTrack에 오신 것을 환영합니다</p>
      </div>

      <div className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleGoogleLogin}
          isLoading={loading}
        >
          Google로 로그인
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            계정이 없으신가요? <span className="text-bright-yellow font-semibold">회원가입</span>
          </button>
        </div>
      </div>
    </Card>
  );
}