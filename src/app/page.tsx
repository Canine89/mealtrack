'use client';

import { useRouter } from 'next/navigation';
import { Utensils, Heart, TrendingUp } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-lavender/30 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-sage/25 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center">
              <Utensils className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">
            MealTrack
          </h1>
          <p className="text-white/80 text-lg">
            매일의 식단을 아름답게 기록하세요
          </p>
        </div>

        {/* 기능 카드들 */}
        <div className="space-y-4">
          <Card glassEffect="medium" hover className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">식단 관리</h3>
                <p className="text-white/70 text-sm">슬라이드로 쉽게 관리하는 일일 식단</p>
              </div>
            </div>
          </Card>

          <Card glassEffect="medium" hover className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sage" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">영양 추적</h3>
                <p className="text-white/70 text-sm">칼로리와 영양성분을 한눈에</p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA 버튼들 */}
        <div className="space-y-3">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={handleGetStarted}
          >
            시작하기
          </Button>
          <Button 
            variant="glass" 
            size="md" 
            className="w-full"
            onClick={handleGetStarted}
          >
            미리보기
          </Button>
        </div>

        {/* 푸터 */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            Glassmorphism으로 만든 아름다운 식단 앱
          </p>
        </div>
      </div>
    </div>
  );
}
