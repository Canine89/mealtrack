'use client';

import { useState, ReactNode } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Edit3, Copy } from 'lucide-react';
import { SwipeAction } from '@/types';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: SwipeAction;
  rightActions?: SwipeAction[];
  disabled?: boolean;
  className?: string;
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = {
    icon: 'trash',
    color: 'red',
    label: '삭제',
    action: () => {}
  },
  rightActions = [
    { icon: 'edit', color: 'blue', label: '수정', action: () => {} },
    { icon: 'copy', color: 'green', label: '복사', action: () => {} }
  ],
  disabled = false,
  className = ''
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  
  // 배경 색상 애니메이션
  const leftBgOpacity = useTransform(x, [-150, -50, 0], [0.8, 0.3, 0]);
  const rightBgOpacity = useTransform(x, [0, 50, 150], [0, 0.3, 0.8]);
  
  // 아이콘 스케일 애니메이션
  const leftIconScale = useTransform(x, [-150, -50, 0], [1.2, 0.8, 0]);
  const rightIconScale = useTransform(x, [0, 50, 150], [0, 0.8, 1.2]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 100;
    
    if (info.offset.x < -threshold && onSwipeLeft) {
      // 왼쪽 스와이프 (삭제)
      leftAction.action();
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      // 오른쪽 스와이프 (수정/복사)
      // 기본적으로 첫 번째 액션 실행
      if (rightActions.length > 0) {
        rightActions[0].action();
      }
      onSwipeRight();
    }
    
    // 카드를 원래 위치로 복귀
    x.set(0);
  };

  const getIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'trash':
        return <Trash2 size={size} />;
      case 'edit':
        return <Edit3 size={size} />;
      case 'copy':
        return <Copy size={size} />;
      default:
        return <Edit3 size={size} />;
    }
  };

  const getActionColor = (color: string) => {
    const colors = {
      red: 'bg-red-500',
      blue: 'bg-blue-500', 
      green: 'bg-green-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (disabled) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* 왼쪽 액션 배경 (삭제) */}
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 bg-red-500"
        style={{ opacity: leftBgOpacity }}
      >
        <motion.div
          style={{ scale: leftIconScale }}
          className="text-white flex flex-col items-center"
        >
          {getIcon(leftAction.icon, 24)}
          <span className="text-xs mt-1 font-medium">{leftAction.label}</span>
        </motion.div>
      </motion.div>

      {/* 오른쪽 액션 배경 (수정/복사) */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 bg-blue-500"
        style={{ opacity: rightBgOpacity }}
      >
        <motion.div
          style={{ scale: rightIconScale }}
          className="text-white flex flex-col items-center"
        >
          {rightActions.length > 0 && getIcon(rightActions[0].icon, 24)}
          <span className="text-xs mt-1 font-medium">
            {rightActions.length > 0 ? rightActions[0].label : '액션'}
          </span>
        </motion.div>
      </motion.div>

      {/* 메인 콘텐츠 카드 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
        whileDrag={{ 
          scale: 0.98,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className={`transition-opacity duration-200 ${isDragging ? 'opacity-90' : 'opacity-100'}`}>
          {children}
        </div>
      </motion.div>

      {/* 햅틱 피드백을 위한 히든 요소 (실제 디바이스에서는 진동) */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full animate-pulse" />
        </div>
      )}
    </div>
  );
}