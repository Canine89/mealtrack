'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import LoginForm from '@/components/forms/LoginForm';
import SignUpForm from '@/components/forms/SignUpForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-lavender/30 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-sage/25 rounded-full blur-2xl animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-peach/20 rounded-full blur-3xl animate-pulse delay-3000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center">
              <Utensils className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">MealTrack</h1>
          <p className="text-white/70 mt-2">건강한 식단, 아름다운 기록</p>
        </motion.div>

        {/* Form transition animation */}
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggleMode={() => setIsLogin(true)} />
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/50 text-sm">
            © 2024 MealTrack. Made with 💝
          </p>
        </motion.div>
      </div>
    </div>
  );
}