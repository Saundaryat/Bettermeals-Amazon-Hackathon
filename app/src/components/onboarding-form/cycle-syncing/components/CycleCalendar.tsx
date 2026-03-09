import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, isValid } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMON_CLASSES } from '../../common/styles';

interface CycleCalendarProps {
    selectedDate: Date | undefined;
    onDateSelect: (date: Date) => void;
    calculatedPhase?: string;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({
    selectedDate,
    onDateSelect,
    calculatedPhase
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = monthStart.getDay();
    const emptyDays = Array(firstDayOfWeek).fill(null);

    const handlePreviousMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextMonth = addMonths(currentMonth, 1);
        if (isBefore(startOfMonth(nextMonth), startOfMonth(addMonths(new Date(), 1)))) {
            setCurrentMonth(nextMonth);
        }
    };

    const canGoNext = isBefore(startOfMonth(currentMonth), startOfMonth(new Date()));

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-full border bg-white transition-all cursor-pointer",
                    isCalendarOpen ? "border-[#51754f] ring-1 ring-[#51754f]/10" : "border-gray-200 hover:border-gray-300"
                )}
            >
                <span className={cn(
                    "text-base",
                    selectedDate ? "text-gray-900" : "text-gray-400"
                )}>
                    {selectedDate && isValid(selectedDate)
                        ? format(selectedDate, 'MMM d, yyyy')
                        : "Select Date"}
                </span>
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4 text-[#51754f]"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
                    </svg>
                </div>
            </button>

            {isCalendarOpen && (
                <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="button"
                            onClick={handlePreviousMonth}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            disabled={!canGoNext}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                canGoNext ? "hover:bg-gray-100" : "opacity-30 cursor-not-allowed"
                            )}
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {emptyDays.map((_, idx) => (
                            <div key={`empty-${idx}`} className="aspect-square" />
                        ))}
                        {daysInMonth.map((day) => {
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isFuture = day > new Date();

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    onClick={() => {
                                        if (!isFuture) {
                                            onDateSelect(day);
                                            setIsCalendarOpen(false);
                                        }
                                    }}
                                    disabled={isFuture}
                                    className={cn(
                                        "aspect-square rounded-full flex items-center justify-center text-base font-semibold transition-all hover:bg-gray-50",
                                        isSelected
                                            ? "bg-[#51754f] text-white hover:bg-[#51754f]"
                                            : isFuture
                                                ? "text-gray-200 cursor-not-allowed"
                                                : "text-gray-900"
                                    )}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {calculatedPhase && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#51754f] text-white rounded-full transition-all animate-in fade-in slide-in-from-top-1">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm font-medium">
                        You're currently in your <span className="capitalize">{calculatedPhase.toLowerCase()}</span>
                    </p>
                </div>
            )}
        </div>
    );
};
