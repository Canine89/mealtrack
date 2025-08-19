import { User } from '@supabase/supabase-js';
import { Food, Meal, MealItem, FoodCategory } from '@/types';

// Mock user data
export const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@mealtrack.com',
  user_metadata: {
    name: '김민지'
  },
  aud: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  role: '',
  last_sign_in_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString()
};

// Mock foods data
export const mockFoods: Food[] = [
  {
    id: '1',
    name: '현미밥',
    category: FoodCategory.CARB,
    calories_per_100g: 350,
    protein_per_100g: 8,
    carbs_per_100g: 72,
    fat_per_100g: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    name: '그릭요거트',
    category: FoodCategory.DAIRY,
    calories_per_100g: 130,
    protein_per_100g: 10,
    carbs_per_100g: 5,
    fat_per_100g: 7,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: '블루베리',
    category: FoodCategory.FRUIT,
    calories_per_100g: 57,
    protein_per_100g: 0.7,
    carbs_per_100g: 14,
    fat_per_100g: 0.3,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: '아보카도',
    category: FoodCategory.FRUIT,
    calories_per_100g: 160,
    protein_per_100g: 2,
    carbs_per_100g: 9,
    fat_per_100g: 15,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: '닭가슴살',
    category: FoodCategory.PROTEIN,
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: '브로콜리',
    category: FoodCategory.VEGETABLE,
    calories_per_100g: 34,
    protein_per_100g: 2.8,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: '토스트',
    category: FoodCategory.CARB,
    calories_per_100g: 265,
    protein_per_100g: 9,
    carbs_per_100g: 49,
    fat_per_100g: 3,
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: '아몬드',
    category: FoodCategory.SNACK,
    calories_per_100g: 576,
    protein_per_100g: 21,
    carbs_per_100g: 22,
    fat_per_100g: 49,
    created_at: new Date().toISOString()
  }
];

// Mock meal items
const mockMealItems: MealItem[] = [
  {
    id: 'item-1',
    meal_id: 'meal-1',
    food_id: '7',
    quantity: 60, // 2조각
    calories: 159,
    food: mockFoods.find(f => f.id === '7')
  },
  {
    id: 'item-2',
    meal_id: 'meal-1', 
    food_id: '2',
    quantity: 150, // 1컵
    calories: 195,
    food: mockFoods.find(f => f.id === '2')
  },
  {
    id: 'item-3',
    meal_id: 'meal-1',
    food_id: '3',
    quantity: 80, // 한줌
    calories: 46,
    food: mockFoods.find(f => f.id === '3')
  },
  {
    id: 'item-4',
    meal_id: 'meal-2',
    food_id: '1',
    quantity: 200, // 1공기
    calories: 700,
    food: mockFoods.find(f => f.id === '1')
  },
  {
    id: 'item-5',
    meal_id: 'meal-2',
    food_id: '5',
    quantity: 120, // 1조각
    calories: 198,
    food: mockFoods.find(f => f.id === '5')
  },
  {
    id: 'item-6',
    meal_id: 'meal-2',
    food_id: '6',
    quantity: 100,
    calories: 34,
    food: mockFoods.find(f => f.id === '6')
  },
  {
    id: 'item-7',
    meal_id: 'meal-4',
    food_id: '8',
    quantity: 30, // 한줌
    calories: 173,
    food: mockFoods.find(f => f.id === '8')
  }
];

// Mock meals data
export const mockMeals: Meal[] = [
  {
    id: 'meal-1',
    user_id: 'mock-user-id',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'breakfast',
    total_calories: 400,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meal_items: mockMealItems.filter(item => item.meal_id === 'meal-1')
  },
  {
    id: 'meal-2',
    user_id: 'mock-user-id',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'lunch',
    total_calories: 932,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meal_items: mockMealItems.filter(item => item.meal_id === 'meal-2')
  },
  {
    id: 'meal-3',
    user_id: 'mock-user-id',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'dinner',
    total_calories: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meal_items: []
  },
  {
    id: 'meal-4',
    user_id: 'mock-user-id',
    date: new Date().toISOString().split('T')[0],
    meal_type: 'snack',
    total_calories: 173,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meal_items: mockMealItems.filter(item => item.meal_id === 'meal-4')
  }
];