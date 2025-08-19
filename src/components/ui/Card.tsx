'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glassEffect?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  glassEffect = 'medium',
  hover = false,
  onClick 
}: CardProps) {
  const baseStyles = 'relative overflow-hidden';
  
  const glassEffects = {
    light: 'glass',
    medium: 'glass-card',
    heavy: 'bg-white/30 backdrop-blur-3xl border border-white/30 rounded-2xl shadow-2xl'
  };

  const hoverStyles = hover ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${glassEffects[glassEffect]} ${hoverStyles} ${className}`}
      onClick={onClick}
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}