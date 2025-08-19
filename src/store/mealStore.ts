import { create } from 'zustand';
import { mockMeals, mockFoods } from '@/lib/mockData';
import { Meal, MealItem, Food, MealType } from '@/types';

interface MealState {
  meals: Meal[];
  loading: boolean;
  currentDate: string;
  
  // Actions
  fetchMeals: (date: string, userId: string) => Promise<void>;
  addMealItem: (mealType: MealType, foodId: string, quantity: number, userId: string) => Promise<void>;
  removeMealItem: (mealItemId: string) => Promise<void>;
  updateMealItem: (mealItemId: string, quantity: number) => Promise<void>;
  setCurrentDate: (date: string) => void;
  
  // Helper functions
  getMealByType: (mealType: MealType) => Meal | undefined;
  getTotalCalories: () => number;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  loading: false,
  currentDate: new Date().toISOString().split('T')[0],

  fetchMeals: async (date: string, userId: string) => {
    set({ loading: true });
    
    // Mock 데이터 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 현재 날짜의 Mock 식사 데이터 반환
    const todayMeals = mockMeals.filter(meal => 
      meal.date === date && meal.user_id === userId
    );
    
    set({ meals: todayMeals, loading: false });
  },

  addMealItem: async (mealType: MealType, foodId: string, quantity: number, userId: string) => {
    const { currentDate, meals } = get();
    
    // Mock 음식 데이터 찾기
    const food = mockFoods.find(f => f.id === foodId);
    if (!food) return;

    const calories = Math.round((food.calories_per_100g * quantity) / 100);

    // 해당 타입의 기존 식사 찾기
    let existingMeal = meals.find(m => m.meal_type === mealType);
    
    const newItem: MealItem = {
      id: `item-${Date.now()}`,
      meal_id: existingMeal?.id || `meal-${Date.now()}`,
      food_id: foodId,
      quantity,
      calories,
      food
    };

    if (existingMeal) {
      // 기존 식사에 아이템 추가
      const updatedMeals = meals.map(meal => 
        meal.id === existingMeal.id 
          ? {
              ...meal,
              meal_items: [...meal.meal_items, newItem],
              total_calories: meal.total_calories + calories
            }
          : meal
      );
      set({ meals: updatedMeals });
    } else {
      // 새 식사 생성
      const newMeal: Meal = {
        id: newItem.meal_id,
        user_id: userId,
        date: currentDate,
        meal_type: mealType,
        total_calories: calories,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meal_items: [newItem]
      };
      set({ meals: [...meals, newMeal] });
    }
  },

  removeMealItem: async (mealItemId: string) => {
    // Mock 삭제: 상태에서 아이템 제거
    const meals = get().meals.map(meal => ({
      ...meal,
      meal_items: meal.meal_items.filter(item => item.id !== mealItemId),
      total_calories: meal.meal_items
        .filter(item => item.id !== mealItemId)
        .reduce((sum, item) => sum + item.calories, 0)
    }));
    set({ meals });
  },

  updateMealItem: async (mealItemId: string, quantity: number) => {
    const meals = get().meals.map(meal => ({
      ...meal,
      meal_items: meal.meal_items.map(item => {
        if (item.id === mealItemId && item.food) {
          const newCalories = Math.round((item.food.calories_per_100g * quantity) / 100);
          return { ...item, quantity, calories: newCalories };
        }
        return item;
      }),
    }));

    // 총 칼로리 재계산
    const updatedMeals = meals.map(meal => ({
      ...meal,
      total_calories: meal.meal_items.reduce((sum, item) => sum + item.calories, 0)
    }));

    set({ meals: updatedMeals });
  },

  setCurrentDate: (date: string) => {
    set({ currentDate: date });
  },

  getMealByType: (mealType: MealType) => {
    return get().meals.find(meal => meal.meal_type === mealType);
  },

  getTotalCalories: () => {
    return get().meals.reduce((total, meal) => {
      return total + meal.meal_items.reduce((mealTotal, item) => {
        return mealTotal + item.calories;
      }, 0);
    }, 0);
  },
}));