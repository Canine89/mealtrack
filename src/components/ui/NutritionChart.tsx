'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface NutritionData {
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionChartProps {
  data: NutritionData;
  size?: 'sm' | 'md' | 'lg';
}

export default function NutritionChart({ data, size = 'md' }: NutritionChartProps) {
  const { protein, carbs, fat } = data;
  
  // 칼로리 계산 (단백질: 4kcal/g, 탄수화물: 4kcal/g, 지방: 9kcal/g)
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  const chartData = [
    {
      name: '단백질',
      value: proteinCalories,
      percentage: totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0,
      grams: protein,
      color: '#f97316' // orange-500
    },
    {
      name: '탄수화물', 
      value: carbsCalories,
      percentage: totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0,
      grams: carbs,
      color: '#eab308' // yellow-500
    },
    {
      name: '지방',
      value: fatCalories,
      percentage: totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0,
      grams: fat,
      color: '#06b6d4' // cyan-500
    }
  ];

  const sizes = {
    sm: { width: 120, height: 120 },
    md: { width: 160, height: 160 },
    lg: { width: 200, height: 200 }
  };

  const currentSize = sizes[size];

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; grams: number; percentage: number; value: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-white/80">{data.grams}g ({data.percentage}%)</p>
          <p className="text-white/60">{data.value}kcal</p>
        </div>
      );
    }
    return null;
  };

  if (totalCalories === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-white/5 rounded-lg"
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <p className="text-white/50 text-sm text-center">
          데이터 없음
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <ResponsiveContainer width={currentSize.width} height={currentSize.height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={size === 'sm' ? 25 : size === 'md' ? 35 : 45}
              outerRadius={size === 'sm' ? 45 : size === 'md' ? 65 : 85}
              paddingAngle={2}
              dataKey="value"
              animationBegin={200}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 중앙 총 칼로리 표시 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-white font-bold text-lg">
            {totalCalories}
          </div>
          <div className="text-white/60 text-xs">
            kcal
          </div>
        </div>
      </motion.div>

      {/* 범례 */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((entry, index) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="flex items-center space-x-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/80 text-sm">
              {entry.name}
            </span>
            <span className="text-white/60 text-sm">
              {entry.grams}g
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}