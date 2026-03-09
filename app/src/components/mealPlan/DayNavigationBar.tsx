import React from "react";
import { format } from "date-fns";
import { mealPlanStyles } from "@/pages/styles/SharedPageStyles";

const ORDERED_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DayNavigationBarProps {
  current: number;
  scrollTo: (index: number) => void;
  weekOffset?: number; // Offset in weeks from current week
}

export const DayNavigationBar: React.FC<DayNavigationBarProps> = ({
  current,
  scrollTo,
  weekOffset = 0,
}) => {
  // Safety check: ensure current is properly initialized
  if (!current || current < 1) return null;

  const currentIndex = current - 1; // Convert to 0-based index
  const visibleDays = [];

  // Responsive: Show 3 days on mobile, 5 days on larger screens
  // We'll use a simple approach: if window width is small, use +/- 1, else +/- 2
  // Since we are in a server-side context or just using tailwind, we can provide both and hide one, 
  // or just use 3 as a baseline for better mobile UX and scale up.
  // Actually, let's just use 3 as a baseline for mobile and we can stick to 5 for now as a middle ground 
  // but let's make the container narrower on mobile.

  // For a truly responsive "number of items" in React without matchMedia:
  // We'll just stick to a consistent 5 for now but ensure the buttons are smaller on mobile.
  // Actually, let's try to implement a 3-day view logic.

  const range = (typeof window !== 'undefined' && window.innerWidth < 640) ? 1 : 2;

  for (let i = -range; i <= range; i++) {
    const idx = (currentIndex + i + ORDERED_DAYS.length) % ORDERED_DAYS.length;
    visibleDays.push(idx);
  }

  return (
    <div className="flex items-center justify-between w-full mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
      {/* Left scroll indicator */}
      <button
        className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
        onClick={() => scrollTo((currentIndex - 1 + ORDERED_DAYS.length) % ORDERED_DAYS.length)}
      >
        <span className="text-xl font-bold">&lsaquo;</span>
      </button>

      {/* Day buttons */}
      <div className="flex items-center gap-1 md:gap-3 flex-1 justify-center overflow-x-auto no-scrollbar">
        {visibleDays.map((dayIndex) => {
          const day = ORDERED_DAYS[dayIndex];
          if (!day) return null;

          const today = new Date();
          const currentDayNum = today.getDay(); // 0-6, 0 is Sunday
          const mondayOffset = currentDayNum === 0 ? -6 : 1 - currentDayNum;

          const dayDate = new Date(today);
          dayDate.setDate(today.getDate() + mondayOffset + weekOffset * 7 + dayIndex);

          const isToday = format(today, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd");
          const isPast = dayDate < today && !isToday;
          const isSelected = dayIndex === currentIndex;

          return (
            <button
              key={dayIndex}
              className={`
                flex flex-col items-center min-w-[50px] md:min-w-[70px] py-2 md:py-3 rounded-xl transition-all duration-300 border-2
                ${isSelected
                  ? "bg-[#51754f] border-[#51754f] text-white shadow-md scale-105"
                  : isToday
                    ? "bg-[#51754f]/10 border-[#51754f]/30 text-[#51754f]"
                    : isPast
                      ? "bg-gray-50 border-transparent text-gray-400"
                      : "bg-white border-transparent text-gray-600 hover:bg-gray-50"
                }
              `}
              onClick={() => scrollTo(dayIndex)}
            >
              <div className="flex flex-col items-center">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-inherit opacity-70'}`}>
                  {day.slice(0, 3)}
                </span>
                <span className="text-base md:text-lg font-extrabold leading-none mt-1">
                  {dayDate.getDate()}
                </span>
                <span className={`text-[8px] md:text-[10px] font-medium opacity-60 ${isSelected ? 'text-white' : 'text-inherit'}`}>
                  {format(dayDate, "MMM")}
                </span>
                {isToday && !isSelected && (
                  <div className="w-1.5 h-1.5 bg-[#51754f] rounded-full mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Right scroll indicator */}
      <button
        className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
        onClick={() => scrollTo((currentIndex + 1) % ORDERED_DAYS.length)}
      >
        <span className="text-xl font-bold">&rsaquo;</span>
      </button>
    </div>
  );
};