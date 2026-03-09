import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { DAYS_OF_WEEK_KEYS, DAYS_OF_WEEK_DISPLAY_NAMES } from './PlannerUtils';

interface WeeklyDaySelectorProps {
    selectedDay: number;
    onDayChange: (dayIndex: number) => void;
    startDate?: Date;
}

/**
 * Component to select a day of the week in Weekly view.
 * Displays a horizontal list of days with navigation arrows.
 */
export const WeeklyDaySelector: React.FC<WeeklyDaySelectorProps> = ({
    selectedDay,
    onDayChange,
    startDate,
}) => {
    const weekStart = startDate || startOfWeek(new Date(), { weekStartsOn: 1 });

    return (
        <div className="flex items-center space-x-1 lg:space-x-2 mb-4 lg:mb-6 overflow-x-auto pb-2">
            <button
                onClick={() => onDayChange(Math.max(0, selectedDay - 1))}
                disabled={selectedDay === 0}
                className="p-1 lg:p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
                <ChevronLeft size={16} className="text-gray-600" />
            </button>

            <div className="flex space-x-1 lg:space-x-2 min-w-0">
                {DAYS_OF_WEEK_KEYS.map((day, index) => (
                    <button
                        key={day}
                        onClick={() => onDayChange(index)}
                        className={`px-2 lg:px-3 py-1 rounded text-xs lg:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${selectedDay === index
                            ? 'bg-[#51754f] text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <span className="hidden sm:inline">
                            {DAYS_OF_WEEK_DISPLAY_NAMES[index].substring(0, 3)} {format(addDays(weekStart, index), 'd')}
                        </span>
                        <span className="sm:hidden">{DAYS_OF_WEEK_DISPLAY_NAMES[index].substring(0, 1)}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={() => onDayChange(Math.min(6, selectedDay + 1))}
                disabled={selectedDay === 6}
                className="p-1 lg:p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
                <ChevronRight size={16} className="text-gray-600" />
            </button>
        </div>
    );
};
