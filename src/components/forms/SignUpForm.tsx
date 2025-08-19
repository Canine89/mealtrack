'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export default function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signUp, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 유효성 검사
    if (!email || !password || !name) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const { error: signUpError } = await signUp(email, password, name);
    
    if (signUpError) {
      if (signUpError.message?.includes('already registered')) {
        setError('이미 등록된 이메일입니다.');
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      setSuccess('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
    }
  };

  return (
    <Card glassEffect="medium" className="p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">회원가입</h2>
        <p className="text-white/70">건강한 식단 관리를 시작해보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-5 h-5" />}
          disabled={loading}
        />

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          disabled={loading}
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 (최소 6자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          disabled={loading}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-300 text-sm"
          >
            {success}
          </motion.div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          회원가입
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            이미 계정이 있으신가요? <span className="text-pink font-semibold">로그인</span>
          </button>
        </div>
      </form>
    </Card>
  );
}