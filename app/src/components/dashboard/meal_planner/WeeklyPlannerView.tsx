import React from 'react';
import { addDays, isToday, isBefore, startOfDay } from 'date-fns';
import { WeeklyDaySelector } from './WeeklyDaySelector';
import { DailyMealList, DayType } from './DailyMealList';
import { UIDayPlan } from './PlannerUtils';

interface WeeklyPlannerViewProps {
    selectedDay: number;
    onDayChange: (dayIndex: number) => void;
    startDate: Date;
    currentDayMeals: UIDayPlan;
    onMealClick: (mealId: string, imageUrl?: string) => void;
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
    selectedDay,
    onDayChange,
    startDate,
    currentDayMeals,
    onMealClick,
}) => {
    // Calculate the actual date of the selected day
    const selectedDate = startOfDay(addDays(startDate, selectedDay));
    const todayDate = startOfDay(new Date());

    // Determine day type for contextual empty states
    let dayType: DayType = 'future';
    if (isToday(selectedDate)) {
        dayType = 'today';
    } else if (isBefore(selectedDate, todayDate)) {
        dayType = 'past';
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            <WeeklyDaySelector
                selectedDay={selectedDay}
                onDayChange={onDayChange}
                startDate={startDate}
            />
            <DailyMealList
                dayMeals={currentDayMeals}
                onMealClick={onMealClick}
                dayType={dayType}
            />
        </div>
    );
};
