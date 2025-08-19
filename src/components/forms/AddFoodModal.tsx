'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Apple, Wheat, Beef, Milk, Carrot, Cookie } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { Food, MealType, FoodCategory } from '@/types';
import { useMealStore } from '@/store/mealStore';
import { useAuthStore } from '@/store/authStore';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
}

export default function AddFoodModal({ isOpen, onClose, mealType }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  
  const { addMealItem } = useMealStore();
  const { user } = useAuthStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 검색 인풋에 포커스 및 음식 데이터 로드
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
      
      // 음식 데이터 로드
      loadFoods();
    }
  }, [isOpen]);

  // Supabase에서 음식 데이터 로드
  const loadFoods = async () => {
    setFoodsLoading(true);
    try {
      const { data: foods, error } = await supabase
        .from('foods')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Failed to load foods:', error);
        return;
      }

      setFoods(foods || []);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setFoodsLoading(false);
    }
  };

  // 검색된 음식 필터링
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.name_en && food.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 카테고리별 아이콘
  const getCategoryIcon = (category: FoodCategory) => {
    const icons = {
      [FoodCategory.FRUIT]: Apple,
      [FoodCategory.VEGETABLE]: Carrot,
      [FoodCategory.PROTEIN]: Beef,
      [FoodCategory.CARB]: Wheat,
      [FoodCategory.DAIRY]: Milk,
      [FoodCategory.SNACK]: Cookie
    };
    const Icon = icons[category] || Cookie;
    return <Icon className="w-4 h-4" />;
  };

  // 카테고리별 컬러
  const getCategoryColor = (category: FoodCategory) => {
    const colors = {
      [FoodCategory.FRUIT]: 'bg-red-500/20 text-red-300 border-red-500/30',
      [FoodCategory.VEGETABLE]: 'bg-green-500/20 text-green-300 border-green-500/30',
      [FoodCategory.PROTEIN]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      [FoodCategory.CARB]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      [FoodCategory.DAIRY]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      [FoodCategory.SNACK]: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[category] || colors[FoodCategory.SNACK];
  };

  // 음식 추가 처리
  const handleAddFood = async () => {
    if (!selectedFood || !user) return;

    setLoading(true);
    try {
      await addMealItem(mealType, selectedFood.id, parseInt(quantity), user.id);
      
      // 성공 후 모달 초기화 및 닫기
      setSelectedFood(null);
      setQuantity('100');
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('음식 추가 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatedCalories = selectedFood 
    ? Math.round((selectedFood.calories_per_100g * parseInt(quantity)) / 100)
    : 0;

  const mealTypeNames = {
    breakfast: '아침',
    lunch: '점심', 
    dinner: '저녁',
    snack: '간식'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mealTypeNames[mealType]} 음식 추가`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* 검색 섹션 */}
        <div>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="음식을 검색해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* 음식 목록 */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {foodsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-bright-yellow border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-white/70">음식 데이터를 불러오는 중...</span>
            </div>
          ) : filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <motion.button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedFood?.id === food.id
                    ? 'bg-bright-yellow/20 border-2 border-bright-yellow/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(food.category)}`}>
                      {getCategoryIcon(food.category)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{food.name}</h4>
                      <p className="text-white/60 text-sm">
                        {food.calories_per_100g}kcal / 100g
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white/80 text-sm">
                      단백질 {food.protein_per_100g}g
                    </div>
                    <div className="text-white/80 text-sm">
                      탄수화물 {food.carbs_per_100g}g
                    </div>
                    <div className="text-white/80 text-sm">
                      지방 {food.fat_per_100g}g
                    </div>
                  </div>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50">검색 결과가 없습니다</p>
              <p className="text-white/30 text-sm mt-1">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>

        {/* 선택된 음식 정보 */}
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-xl p-4 space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(selectedFood.category)}`}>
                {getCategoryIcon(selectedFood.category)}
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">{selectedFood.name}</h4>
                <p className="text-white/70">100g당 {selectedFood.calories_per_100g}kcal</p>
              </div>
            </div>

            {/* 수량 입력 */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-white/80 text-sm mb-2">수량 (g)</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max="1000"
                />
              </div>
              
              <div className="text-right">
                <div className="text-white/60 text-sm">총 칼로리</div>
                <div className="text-2xl font-bold text-white">
                  {calculatedCalories} <span className="text-lg font-normal">kcal</span>
                </div>
              </div>
            </div>

            {/* 영양성분 미리보기 */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-orange-500/10 rounded-lg p-3">
                <div className="text-orange-300 text-sm">단백질</div>
                <div className="text-white font-semibold">
                  {Math.round((selectedFood.protein_per_100g * parseInt(quantity)) / 100)}g
                </div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <div className="text-green-300 text-sm">탄수화물</div>
                <div className="text-white font-semibold">
                  {Math.round((selectedFood.carbs_per_100g * parseInt(quantity)) / 100)}g
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <div className="text-blue-300 text-sm">지방</div>
                <div className="text-white font-semibold">
                  {Math.round((selectedFood.fat_per_100g * parseInt(quantity)) / 100)}g
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 액션 버튼 */}
        <div className="flex space-x-3">
          <Button
            variant="glass"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleAddFood}
            className="flex-1"
            isLoading={loading}
            disabled={!selectedFood}
          >
            <Plus className="w-4 h-4" />
            <span>추가하기</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}