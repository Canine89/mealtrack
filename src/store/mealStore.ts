import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Meal, MealType, Food } from '@/types';
import { Database } from '@/types/database';
import { toast } from '@/store/toastStore';

type MealRow = Database['public']['Tables']['meals']['Row'];
type MealItemRow = Database['public']['Tables']['meal_items']['Row'];
type FoodRow = Database['public']['Tables']['foods']['Row'];

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

// 데이터베이스 행을 앱 타입으로 변환하는 헬퍼 함수들
const transformMealFromDB = (mealRow: MealRow, itemsWithFood: (MealItemRow & { food: FoodRow })[]): Meal => ({
  id: mealRow.id,
  user_id: mealRow.user_id,
  date: mealRow.date,
  meal_type: mealRow.meal_type as MealType,
  total_calories: mealRow.total_calories || 0,
  created_at: mealRow.created_at,
  updated_at: mealRow.updated_at,
  meal_items: itemsWithFood.map(item => ({
    id: item.id,
    meal_id: item.meal_id,
    food_id: item.food_id,
    quantity: item.quantity,
    calories: item.calories,
    food: {
      id: item.food.id,
      name: item.food.name,
      category: item.food.category,
      calories_per_100g: item.food.calories_per_100g,
      protein_per_100g: item.food.protein_per_100g,
      carbs_per_100g: item.food.carbs_per_100g,
      fat_per_100g: item.food.fat_per_100g,
      created_at: item.food.created_at,
    } as Food
  }))
});

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  loading: false,
  currentDate: new Date().toISOString().split('T')[0],

  fetchMeals: async (date: string, userId: string) => {
    set({ loading: true });
    
    try {
      // 해당 날짜의 식사 데이터 조회 (meal_items와 foods를 조인해서)
      const { data: meals, error } = await supabase
        .from('meals')
        .select(`
          *,
          meal_items (
            *,
            food:foods (*)
          )
        `)
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to fetch meals:', error);
        set({ meals: [], loading: false });
        return;
      }

      // 데이터 변환
      const transformedMeals: Meal[] = meals?.map(meal => 
        transformMealFromDB(meal, meal.meal_items || [])
      ) || [];

      set({ meals: transformedMeals, loading: false });
    } catch (error) {
      console.error('Error fetching meals:', error);
      set({ meals: [], loading: false });
    }
  },

  addMealItem: async (mealType: MealType, foodId: string, quantity: number, userId: string) => {
    const { currentDate } = get();
    
    try {
      // 1. 음식 정보 가져오기
      const { data: food, error: foodError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', foodId)
        .single();

      if (foodError || !food) {
        console.error('Failed to fetch food:', foodError);
        return;
      }

      // 2. 해당 날짜와 식사 타입의 기존 식사 찾기
      const { data: existingMeals, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .eq('date', currentDate)
        .eq('meal_type', mealType);

      if (mealsError) {
        console.error('Failed to fetch existing meals:', mealsError);
        return;
      }

      const calories = Math.round((food.calories_per_100g * quantity) / 100);
      let mealId: string;

      if (existingMeals && existingMeals.length > 0) {
        // 기존 식사가 있는 경우
        mealId = existingMeals[0].id;
        
        // 식사의 총 칼로리 업데이트
        const newTotalCalories = (existingMeals[0].total_calories || 0) + calories;
        await supabase
          .from('meals')
          .update({ 
            total_calories: newTotalCalories,
            updated_at: new Date().toISOString()
          })
          .eq('id', mealId);
      } else {
        // 새 식사 생성
        const { data: newMeal, error: mealInsertError } = await supabase
          .from('meals')
          .insert({
            user_id: userId,
            date: currentDate,
            meal_type: mealType,
            total_calories: calories,
          })
          .select()
          .single();

        if (mealInsertError || !newMeal) {
          console.error('Failed to create meal:', mealInsertError);
          return;
        }

        mealId = newMeal.id;
      }

      // 3. 식사 아이템 추가
      const { error: itemError } = await supabase
        .from('meal_items')
        .insert({
          meal_id: mealId,
          food_id: foodId,
          quantity: quantity,
          calories: calories,
        });

      if (itemError) {
        console.error('Failed to add meal item:', itemError);
        return;
      }

      // 4. 상태 새로고침
      await get().fetchMeals(currentDate, userId);
      
      // 성공 알림
      toast.success('음식 추가 완료', `${food.name}이(가) 식단에 추가되었습니다.`);
    } catch (error) {
      console.error('Error adding meal item:', error);
      toast.error('음식 추가 실패', '음식을 추가하는 중 오류가 발생했습니다.');
    }
  },

  removeMealItem: async (mealItemId: string) => {
    const { currentDate } = get();
    
    try {
      // 1. 해당 아이템 정보 가져오기
      const { data: item, error: itemError } = await supabase
        .from('meal_items')
        .select('*, meal:meals(*)')
        .eq('id', mealItemId)
        .single();

      if (itemError || !item) {
        console.error('Failed to fetch meal item:', itemError);
        return;
      }

      // 2. 아이템 삭제
      const { error: deleteError } = await supabase
        .from('meal_items')
        .delete()
        .eq('id', mealItemId);

      if (deleteError) {
        console.error('Failed to delete meal item:', deleteError);
        return;
      }

      // 3. 식사의 총 칼로리 업데이트
      if (item.meal) {
        const newTotalCalories = Math.max(0, (item.meal.total_calories || 0) - item.calories);
        await supabase
          .from('meals')
          .update({ 
            total_calories: newTotalCalories,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.meal_id);
      }

      // 4. 상태 새로고침
      if (typeof window !== 'undefined') {
        // 현재 로그인된 사용자 정보를 가져와서 새로고침
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await get().fetchMeals(currentDate, currentUser.id);
        }
      }
      
      toast.success('음식 삭제 완료', '음식이 식단에서 삭제되었습니다.');
    } catch (error) {
      console.error('Error removing meal item:', error);
      toast.error('음식 삭제 실패', '음식을 삭제하는 중 오류가 발생했습니다.');
    }
  },

  updateMealItem: async (mealItemId: string, quantity: number) => {
    const { currentDate } = get();
    
    try {
      // 1. 기존 아이템 정보 가져오기
      const { data: item, error: itemError } = await supabase
        .from('meal_items')
        .select('*, food:foods(*), meal:meals(*)')
        .eq('id', mealItemId)
        .single();

      if (itemError || !item || !item.food) {
        console.error('Failed to fetch meal item:', itemError);
        return;
      }

      // 2. 새로운 칼로리 계산
      const newCalories = Math.round((item.food.calories_per_100g * quantity) / 100);
      const calorieDiff = newCalories - item.calories;

      // 3. 아이템 업데이트
      const { error: updateError } = await supabase
        .from('meal_items')
        .update({
          quantity: quantity,
          calories: newCalories,
        })
        .eq('id', mealItemId);

      if (updateError) {
        console.error('Failed to update meal item:', updateError);
        return;
      }

      // 4. 식사의 총 칼로리 업데이트
      if (item.meal) {
        const newTotalCalories = Math.max(0, (item.meal.total_calories || 0) + calorieDiff);
        await supabase
          .from('meals')
          .update({ 
            total_calories: newTotalCalories,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.meal_id);
      }

      // 5. 상태 새로고침
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await get().fetchMeals(currentDate, currentUser.id);
      }
    } catch (error) {
      console.error('Error updating meal item:', error);
    }
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