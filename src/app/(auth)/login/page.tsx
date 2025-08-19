'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Sparkles, ArrowLeft } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import LoginForm from '@/components/forms/LoginForm';
import SignUpForm from '@/components/forms/SignUpForm';

export default function AuthPage() {
  const [showTraditionalAuth, setShowTraditionalAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-bright-yellow/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-warm-beige/25 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-dark-blue/15 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-dark-blue via-warm-beige to-bright-yellow rounded-2xl mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Utensils className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Meal<span className="text-bright-yellow">Track</span>
          </h1>
          <p className="text-white/70 flex items-center justify-center">
            <Sparkles className="w-4 h-4 mr-2" />
            아름다운 식단 관리의 시작
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          {!showTraditionalAuth ? (
            // Google 로그인 우선
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-2">간편하게 시작하세요</h2>
                <p className="text-white/60 text-sm">Google 계정으로 빠르고 안전하게 로그인</p>
              </div>

              <GoogleSignInButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/60">또는</span>
                </div>
              </div>

              <button
                onClick={() => setShowTraditionalAuth(true)}
                className="w-full text-center text-white/70 text-sm hover:text-white transition-colors underline"
              >
                이메일로 로그인하기
              </button>
            </div>
          ) : (
            // 기존 이메일 로그인/회원가입
            <div>
              <button
                onClick={() => setShowTraditionalAuth(false)}
                className="mb-6 flex items-center text-white/70 text-sm hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                뒤로 가기
              </button>

              <div className="flex mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                    isLogin 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  로그인
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                    !isLogin 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  회원가입
                </button>
              </div>

              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/50 text-sm mt-6"
        >
          건강한 식단 관리로 더 나은 내일을 만들어보세요 ✨
        </motion.p>
      </div>
    </div>
  );
}