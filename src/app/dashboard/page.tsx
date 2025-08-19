'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Settings, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NutritionChart from '@/components/ui/NutritionChart';
import { MealItemCard } from '@/components/meal';
import AddFoodModal from '@/components/forms/AddFoodModal';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { MealType } from '@/types';

export default function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const { meals, currentDate, fetchMeals, getTotalCalories, removeMealItem } = useMealStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.BREAKFAST);

  useEffect(() => {
    if (user) {
      fetchMeals(currentDate, user.id);
    }
  }, [user, currentDate, fetchMeals]);

  const mealTypes = [
    { 
      type: 'breakfast' as const, 
      title: '아침', 
      emoji: '🌅', 
      time: '07:00-09:00',
      gradient: 'from-orange-400/20 to-yellow-400/20'
    },
    { 
      type: 'lunch' as const, 
      title: '점심', 
      emoji: '☀️', 
      time: '12:00-14:00',
      gradient: 'from-green-400/20 to-blue-400/20'
    },
    { 
      type: 'dinner' as const, 
      title: '저녁', 
      emoji: '🌙', 
      time: '18:00-20:00',
      gradient: 'from-purple-400/20 to-pink-400/20'
    },
    { 
      type: 'snack' as const, 
      title: '간식', 
      emoji: '🍎', 
      time: '언제든지',
      gradient: 'from-pink-400/20 to-rose-400/20'
    }
  ];

  const totalCalories = getTotalCalories();
  const targetCalories = 2000; // 나중에 사용자 설정으로 변경
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);

  // 음식 추가 모달 열기
  const handleAddFood = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setModalOpen(true);
  };

  // 음식 삭제
  const handleDeleteFood = async (itemId: string) => {
    if (confirm('이 음식을 삭제하시겠습니까?')) {
      await removeMealItem(itemId);
    }
  };

  // 총 영양성분 계산
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

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-lavender/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              안녕하세요, {user?.user_metadata?.name || user?.email}님! 👋
            </h1>
            <p className="text-white/70">
              오늘도 건강한 하루 보내세요
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="glass" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(currentDate).toLocaleDateString('ko-KR')}
            </Button>
            <Button variant="glass" size="sm" onClick={signOut}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* 칼로리 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glassEffect="medium" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">오늘의 칼로리</h3>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{totalCalories}</p>
                <p className="text-white/70 text-sm">/ {targetCalories} kcal</p>
              </div>
            </div>
            
            {/* 프로그레스 바 */}
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <motion.div
                className="bg-gradient-to-r from-pink to-lavender h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calorieProgress}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-white/60 text-sm text-center">
              목표의 {Math.round(calorieProgress)}% 달성
            </p>
          </Card>
        </motion.div>

        {/* 영양성분 차트 */}
        {totalCalories > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glassEffect="medium" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">영양성분</h3>
                <div className="text-white/60 text-sm">
                  오늘 섭취량
                </div>
              </div>
              
              <div className="flex justify-center">
                <NutritionChart data={totalNutrition} size="md" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* 식사 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealTypes.map((mealType, index) => {
            const meal = meals.find(m => m.meal_type === mealType.type);
            const mealCalories = meal?.meal_items.reduce((sum, item) => sum + item.calories, 0) || 0;
            
            return (
              <motion.div
                key={mealType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card glassEffect="medium" hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${mealType.gradient} rounded-full flex items-center justify-center text-2xl`}>
                        {mealType.emoji}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{mealType.title}</h4>
                        <p className="text-white/60 text-sm">{mealType.time}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="glass" 
                      size="sm"
                      onClick={() => handleAddFood(mealType.type)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 min-h-[60px]">
                    {meal?.meal_items.length ? (
                      meal.meal_items.map((item, itemIndex) => (
                        <MealItemCard
                          key={item.id}
                          item={item}
                          index={itemIndex}
                          onEdit={(item) => {
                            console.log('Edit item:', item);
                            // TODO: 수정 모달 열기
                          }}
                          onDelete={handleDeleteFood}
                          onCopy={(item) => {
                            console.log('Copy item:', item);
                            // TODO: 다른 식사에 복사
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-white/50 text-sm">아직 식사를 추가하지 않았습니다</p>
                        <p className="text-white/30 text-xs mt-1">+ 버튼을 눌러 음식을 추가해보세요</p>
                      </div>
                    )}
                  </div>

                  {mealCalories > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">총 칼로리</span>
                        <span className="text-white font-bold">{mealCalories} kcal</span>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* 푸터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-8"
        >
          <p className="text-white/50 text-sm">
            MealTrack으로 건강한 식단을 관리하세요 ✨
          </p>
        </motion.div>
      </div>

      {/* 음식 추가 모달 */}
      <AddFoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mealType={selectedMealType}
      />
    </div>
  );
}