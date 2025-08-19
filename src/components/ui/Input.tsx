'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  glass?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  glass = true,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 text-white placeholder-white/70 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink/50';
  
  const glassStyles = glass 
    ? 'bg-white/10 backdrop-blur-sm border-white/20 focus:bg-white/20 focus:border-white/40'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-pink focus:border-pink';

  return (
    <div className="w-full">
      {label && (
        <motion.label 
          className="block text-sm font-medium text-white/90 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={`${baseStyles} ${glassStyles} ${icon ? 'pl-10' : ''} ${className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p 
          className="mt-1 text-sm text-red-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;