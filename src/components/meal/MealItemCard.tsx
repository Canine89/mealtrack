'use client';

import { motion } from 'framer-motion';
import { SwipeableCard } from '@/components/swipe';
import { MealItem } from '@/types';

interface MealItemCardProps {
  item: MealItem;
  onEdit: (item: MealItem) => void;
  onDelete: (itemId: string) => void;
  onCopy: (item: MealItem) => void;
  index: number;
}

export default function MealItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  onCopy,
  index 
}: MealItemCardProps) {
  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleCopy = () => {
    onCopy(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.1 }}
    >
      <SwipeableCard
        onSwipeLeft={handleDelete}
        onSwipeRight={handleEdit}
        leftAction={{
          icon: 'trash',
          color: 'red',
          label: '삭제',
          action: handleDelete
        }}
        rightActions={[
          {
            icon: 'edit',
            color: 'blue', 
            label: '수정',
            action: handleEdit
          },
          {
            icon: 'copy',
            color: 'green',
            label: '복사', 
            action: handleCopy
          }
        ]}
        className="mb-2"
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className="text-white font-medium">
                {item.food?.name || '음식'}
              </h4>
              <p className="text-white/60 text-sm mt-1">
                {item.quantity}g
              </p>
              
              {/* 영양성분 미니 표시 */}
              {item.food && (
                <div className="flex space-x-3 mt-2 text-xs text-white/50">
                  <span>단백질 {Math.round((item.food.protein_per_100g * item.quantity) / 100)}g</span>
                  <span>탄수화물 {Math.round((item.food.carbs_per_100g * item.quantity) / 100)}g</span>
                  <span>지방 {Math.round((item.food.fat_per_100g * item.quantity) / 100)}g</span>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {item.calories}
              </div>
              <div className="text-white/60 text-sm">
                kcal
              </div>
            </div>
          </div>

          {/* 카테고리 표시 */}
          {item.food?.category && (
            <div className="mt-3">
              <CategoryBadge category={item.food.category} />
            </div>
          )}
        </div>
      </SwipeableCard>
    </motion.div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const categoryStyles = {
    fruit: 'bg-red-500/20 text-red-300 border-red-500/30',
    vegetable: 'bg-green-500/20 text-green-300 border-green-500/30', 
    protein: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    carb: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    dairy: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    snack: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  };

  const categoryNames = {
    fruit: '🍎 과일',
    vegetable: '🥗 채소',
    protein: '🍖 단백질',
    carb: '🍞 탄수화물', 
    dairy: '🥛 유제품',
    snack: '🍪 간식'
  };

  const style = categoryStyles[category as keyof typeof categoryStyles] || categoryStyles.snack;
  const name = categoryNames[category as keyof typeof categoryNames] || '기타';

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${style}`}>
      {name}
    </span>
  );
}