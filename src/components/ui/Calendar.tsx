'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  className?: string;
}

export default function Calendar({ selectedDate, onDateSelect, className = '' }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  
  const today = new Date();
  const selected = new Date(selectedDate);
  
  // 월의 첫 날과 마지막 날
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  // 달력 시작일 (이전 달의 마지막 주)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // 6주 분량의 날짜 생성
  const dates = [];
  const currentDate = new Date(startDate);
  
  for (let week = 0; week < 6; week++) {
    const weekDates = [];
    for (let day = 0; day < 7; day++) {
      weekDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    dates.push(weekDates);
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selected.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    onDateSelect(dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className={`glass-card p-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="glass"
          size="sm"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-white">
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </h3>
        
        <Button
          variant="glass"
          size="sm"
          onClick={goToNextMonth}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-white/60 text-sm py-2 font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="space-y-1">
        {dates.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              const isTodayDate = isToday(date);
              const isSelectedDate = isSelected(date);
              const isCurrentMonthDate = isCurrentMonth(date);
              
              return (
                <motion.button
                  key={dayIndex}
                  onClick={() => handleDateClick(date)}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg
                    transition-all duration-200 relative
                    ${isCurrentMonthDate ? 'text-white' : 'text-white/30'}
                    ${isTodayDate ? 'bg-pink/30 border border-pink/50 font-bold' : ''}
                    ${isSelectedDate ? 'bg-lavender/40 border border-lavender/60 font-semibold' : ''}
                    ${!isTodayDate && !isSelectedDate ? 'hover:bg-white/10' : ''}
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {date.getDate()}
                  
                  {/* 오늘 표시 점 */}
                  {isTodayDate && !isSelectedDate && (
                    <div className="absolute bottom-1 w-1 h-1 bg-pink rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex justify-center space-x-4 mt-4 text-xs text-white/60">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-pink/50 rounded-full" />
          <span>오늘</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-lavender/50 rounded-full" />
          <span>선택됨</span>
        </div>
      </div>
    </div>
  );
}