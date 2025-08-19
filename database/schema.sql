-- MealTrack Database Schema
-- This script creates the database tables and sets up Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    target_calories INTEGER DEFAULT 2000,
    height DECIMAL(5,2), -- cm 단위
    weight DECIMAL(5,2), -- kg 단위
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Foods table (음식 정보)
CREATE TABLE public.foods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('fruit', 'vegetable', 'protein', 'carb', 'dairy', 'snack')),
    calories_per_100g INTEGER NOT NULL,
    protein_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
    carbs_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
    fat_per_100g DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Meals table (식사 기록)
CREATE TABLE public.meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    total_calories INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, date, meal_type)
);

-- Meal items table (식사 내 음식 항목들)
CREATE TABLE public.meal_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
    food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL, -- 그램 단위
    calories INTEGER NOT NULL
);

-- 자동으로 updated_at 업데이트하는 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- profiles 테이블에 updated_at 트리거 설정
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- meals 테이블에 updated_at 트리거 설정
CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON public.meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
-- foods 테이블은 모든 사용자가 읽을 수 있어야 하므로 RLS를 활성화하지 않습니다.

-- RLS 정책 설정
-- Profiles: 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Meals: 사용자는 자신의 식사 기록만 조회/수정 가능
CREATE POLICY "Users can view own meals" ON public.meals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meals" ON public.meals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON public.meals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON public.meals
    FOR DELETE USING (auth.uid() = user_id);

-- Meal items: 사용자는 자신의 식사에 속한 음식만 조회/수정 가능
CREATE POLICY "Users can view own meal items" ON public.meal_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meals
            WHERE meals.id = meal_items.meal_id
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own meal items" ON public.meal_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meals
            WHERE meals.id = meal_items.meal_id
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own meal items" ON public.meal_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.meals
            WHERE meals.id = meal_items.meal_id
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own meal items" ON public.meal_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.meals
            WHERE meals.id = meal_items.meal_id
            AND meals.user_id = auth.uid()
        )
    );

-- 인덱스 생성
CREATE INDEX idx_meals_user_date ON public.meals(user_id, date);
CREATE INDEX idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX idx_foods_category ON public.foods(category);
CREATE INDEX idx_foods_name ON public.foods(name);