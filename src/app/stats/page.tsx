'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NutritionChart from '@/components/ui/NutritionChart';
import { useMealStore } from '@/store/mealStore';
import { useAuthStore } from '@/store/authStore';

interface StatsData {
  totalDays: number;
  averageCalories: number;
  totalCalories: number;
  mostActiveDay: string;
  streakDays: number;
  weeklyData: { day: string; calories: number }[];
}

export default function StatsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { meals } = useMealStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const calculateStats = () => {
      // 모든 식사 데이터로부터 통계 계산
      const totalCalories = meals.reduce((total, meal) => {
        return total + meal.meal_items.reduce((mealTotal, item) => mealTotal + item.calories, 0);
      }, 0);

      // 주간 데이터 생성 (임시 데이터)
      const weeklyData = [
        { day: '월', calories: 1850 },
        { day: '화', calories: 2100 },
        { day: '수', calories: 1950 },
        { day: '목', calories: 2200 },
        { day: '금', calories: 1800 },
        { day: '토', calories: 2050 },
        { day: '일', calories: 1900 },
      ];

      setStats({
        totalDays: 30,
        averageCalories: Math.round(totalCalories / 7) || 1950,
        totalCalories,
        mostActiveDay: '목요일',
        streakDays: 12,
        weeklyData
      });
    };

    if (user && meals.length > 0) {
      calculateStats();
    }
  }, [user, meals, timeRange]);


  // 전체 영양소 계산
  const getTotalNutrition = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(meal => {
      meal.meal_items.forEach(item => {
        if (item.food) {
          const ratio = item.quantity / 100;
          totalProtein += item.food.protein_per_100g * ratio;
          totalCarbs += item.food.carbs_per_100g * ratio;
          totalFat += item.food.fat_per_100g * ratio;
        }
      });
    });

    return {
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10
    };
  };

  const totalNutrition = getTotalNutrition();
  const targetCalories = 2000;

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-lavender/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-pink/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-white">통계</h1>
              <p className="text-white/70">나의 식단 분석</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'glass'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === 'week' ? '주간' : range === 'month' ? '월간' : '연간'}
              </Button>
            ))}
          </div>
        </motion.div>

        {stats && (
          <>
            {/* 주요 지표 카드들 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card glassEffect="medium" className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">평균 칼로리</p>
                      <p className="text-white font-bold">{stats.averageCalories}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card glassEffect="medium" className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">기록 일수</p>
                      <p className="text-white font-bold">{stats.totalDays}일</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card glassEffect="medium" className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">연속 기록</p>
                      <p className="text-white font-bold">{stats.streakDays}일</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card glassEffect="medium" className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">목표 달성률</p>
                      <p className="text-white font-bold">{Math.round((stats.averageCalories / targetCalories) * 100)}%</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* 주간 칼로리 차트 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card glassEffect="medium" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">주간 칼로리 추이</h3>
                
                <div className="space-y-4">
                  {stats.weeklyData.map((data, index) => {
                    const percentage = (data.calories / 2500) * 100;
                    return (
                      <div key={data.day} className="flex items-center space-x-4">
                        <div className="w-8 text-white/80 text-sm font-medium">{data.day}</div>
                        <div className="flex-1">
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-pink to-lavender h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percentage, 100)}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            />
                          </div>
                        </div>
                        <div className="w-20 text-right text-white/80 text-sm font-medium">
                          {data.calories} kcal
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">주간 평균</span>
                    <span className="text-white font-medium">
                      {Math.round(stats.weeklyData.reduce((sum, d) => sum + d.calories, 0) / 7)} kcal
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 영양성분 분석 */}
            {(totalNutrition.protein > 0 || totalNutrition.carbs > 0 || totalNutrition.fat > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card glassEffect="medium" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">영양성분 분석</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex justify-center">
                      <NutritionChart data={totalNutrition} size="lg" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center lg:text-left">
                        <h4 className="text-lg font-medium text-white mb-4">주요 영양소</h4>
                      </div>
                      
                      {[
                        { label: '단백질', value: totalNutrition.protein, color: 'from-blue-400 to-cyan-400', unit: 'g' },
                        { label: '탄수화물', value: totalNutrition.carbs, color: 'from-green-400 to-emerald-400', unit: 'g' },
                        { label: '지방', value: totalNutrition.fat, color: 'from-pink-400 to-rose-400', unit: 'g' }
                      ].map((nutrient) => (
                        <div key={nutrient.label} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80">{nutrient.label}</span>
                            <span className="text-white font-medium">{nutrient.value}{nutrient.unit}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${nutrient.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${Math.min((nutrient.value / 100) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 개선 제안 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card glassEffect="medium" className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">💡 개선 제안</h3>
                
                <div className="space-y-3">
                  {stats.averageCalories < targetCalories * 0.8 && (
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-orange-200 text-sm">
                        📊 평균 칼로리가 목표보다 낮습니다. 건강한 간식을 추가해보세요.
                      </p>
                    </div>
                  )}
                  
                  {stats.streakDays >= 7 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-200 text-sm">
                        🎉 훌륭해요! {stats.streakDays}일 연속 기록을 유지하고 있습니다.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      💪 가장 활발한 요일은 {stats.mostActiveDay}입니다. 이 패턴을 다른 요일에도 적용해보세요.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}