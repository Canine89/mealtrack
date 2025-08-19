'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'relative font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-bright-yellow to-warm-beige text-dark-blue shadow-lg hover:shadow-xl focus:ring-bright-yellow/50',
    secondary: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 focus:ring-white/50',
    glass: 'glass-button text-white focus:ring-white/50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      onClick={onClick}
      type={type}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-dark-blue border-t-transparent rounded-full animate-spin"></div>
          <span>로딩중...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          {children}
        </div>
      )}
    </motion.button>
  );
}