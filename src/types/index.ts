// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  target_calories?: number;
  created_at: string;
  updated_at: string;
}

// 음식 관련 타입
export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  created_at: string;
}

export enum FoodCategory {
  FRUIT = 'fruit',
  VEGETABLE = 'vegetable', 
  PROTEIN = 'protein',
  CARB = 'carb',
  DAIRY = 'dairy',
  SNACK = 'snack'
}

// 식사 관련 타입
export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  total_calories: number;
  created_at: string;
  updated_at: string;
  meal_items: MealItem[];
}

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch', 
  DINNER = 'dinner',
  SNACK = 'snack'
}

export interface MealItem {
  id: string;
  meal_id: string;
  food_id: string;
  quantity: number; // g 단위
  calories: number;
  food?: Food;
}

// UI 관련 타입
export interface SwipeAction {
  icon: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
  label: string;
  action: () => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  glassEffect?: 'light' | 'medium' | 'heavy';
}