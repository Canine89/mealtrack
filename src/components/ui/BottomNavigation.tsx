'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, User, TrendingUp } from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: '홈', path: '/dashboard' },
  { icon: Calendar, label: '캘린더', path: '/calendar' },
  { icon: TrendingUp, label: '통계', path: '/stats' },
  { icon: User, label: '프로필', path: '/profile' },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // 인증 페이지에서는 네비게이션 숨기기
  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  return (
    <div className="p-4">
      <div className="glass-nav rounded-2xl">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center space-y-1 py-1.5 px-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-bright-yellow/20 text-white shadow-md' 
                    : 'text-white/60 hover:text-white hover:bg-warm-beige/15'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-normal">{item.label}</span>
                
                {/* 활성 상태 인디케이터 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 bg-bright-yellow rounded-full shadow-lg shadow-bright-yellow/50"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* 홈 인디케이터 (iPhone 스타일) */}
        <div className="flex justify-center pb-2">
          <div className="w-36 h-1 bg-warm-beige/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}