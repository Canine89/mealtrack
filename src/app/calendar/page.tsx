'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Calendar from '@/components/ui/Calendar';
import { useMealStore } from '@/store/mealStore';
import { useAuthStore } from '@/store/authStore';

export default function CalendarPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { meals, currentDate, setCurrentDate, fetchMeals } = useMealStore();
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    if (user && selectedDate) {
      setCurrentDate(selectedDate);
      fetchMeals(selectedDate, user.id);
    }
  }, [selectedDate, user, setCurrentDate, fetchMeals]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // 선택된 날짜의 식단 요약
  const dayMeals = meals || [];
  const dayTotalCalories = dayMeals.reduce((total, meal) => {
    return total + meal.meal_items.reduce((mealTotal, item) => mealTotal + item.calories, 0);
  }, 0);

  const mealTypeCounts = {
    breakfast: dayMeals.find(m => m.meal_type === 'breakfast')?.meal_items.length || 0,
    lunch: dayMeals.find(m => m.meal_type === 'lunch')?.meal_items.length || 0,
    dinner: dayMeals.find(m => m.meal_type === 'dinner')?.meal_items.length || 0,
    snack: dayMeals.find(m => m.meal_type === 'snack')?.meal_items.length || 0,
  };

  const selectedDateObj = new Date(selectedDate);
  const formattedDate = selectedDateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-warm-beige/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-bright-yellow/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">캘린더</h1>
              <p className="text-white/70">식단 기록 보기</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/60 text-sm">목표: 2000kcal</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-white font-semibold">{dayTotalCalories}kcal</span>
            </div>
          </div>
        </motion.div>

        {/* 캘린더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </motion.div>

        {/* 선택된 날짜 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
            {/* 날짜 정보 */}
            <Card glassEffect="medium" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                선택된 날짜
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {formattedDate}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">총 칼로리</span>
                  <span className="text-white font-semibold">{dayTotalCalories} kcal</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink to-lavender h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dayTotalCalories / 2000) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="text-center text-white/60 text-sm">
                  목표의 {Math.round((dayTotalCalories / 2000) * 100)}% 달성
                </div>
              </div>
            </Card>

            {/* 식사별 요약 */}
            <Card glassEffect="medium" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                식사 요약
              </h3>
              
              <div className="space-y-3">
                {[
                  { key: 'breakfast', label: '🌅 아침', emoji: '🌅' },
                  { key: 'lunch', label: '☀️ 점심', emoji: '☀️' },
                  { key: 'dinner', label: '🌙 저녁', emoji: '🌙' },
                  { key: 'snack', label: '🍎 간식', emoji: '🍎' }
                ].map(({ key, label, emoji }) => {
                  const count = mealTypeCounts[key as keyof typeof mealTypeCounts];
                  const meal = dayMeals.find(m => m.meal_type === key);
                  const calories = meal?.meal_items.reduce((sum, item) => sum + item.calories, 0) || 0;
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{emoji}</span>
                        <span className="text-white/80">{label.substring(2)}</span>
                      </div>
                      <div className="text-right">
                        {count > 0 ? (
                          <>
                            <div className="text-white font-medium">{calories}kcal</div>
                            <div className="text-white/50 text-xs">{count}개 항목</div>
                          </>
                        ) : (
                          <div className="text-white/40 text-sm">기록 없음</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 통계 카드 */}
            {dayTotalCalories > 0 && (
              <Card glassEffect="medium" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  이 날의 기록
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">총 식사</span>
                    <span className="text-white">
                      {Object.values(mealTypeCounts).reduce((a, b) => a + b, 0)}개 항목
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">완성된 식사</span>
                    <span className="text-white">
                      {Object.values(mealTypeCounts).filter(count => count > 0).length}/4
                    </span>
                  </div>
                </div>
              </Card>
            )}
        </motion.div>
      </div>
    </div>
  );
}