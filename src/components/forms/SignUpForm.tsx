'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export default function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [error, setError] = useState('');

  const { signInWithGoogle, loading } = useAuthStore();

  const handleGoogleSignUp = async () => {
    setError('');
    const { error: signInError } = await signInWithGoogle();
    
    if (signInError) {
      setError('Google 회원가입에 실패했습니다.');
    }
  };

  return (
    <Card glassEffect="medium" className="p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">회원가입</h2>
        <p className="text-white/70">건강한 식단 관리를 시작해보세요</p>
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
          onClick={handleGoogleSignUp}
          isLoading={loading}
        >
          Google로 회원가입
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            이미 계정이 있으신가요? <span className="text-bright-yellow font-semibold">로그인</span>
          </button>
        </div>
      </div>
    </Card>
  );
}