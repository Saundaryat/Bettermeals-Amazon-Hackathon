import React from 'react';
import { MealDisplay } from '@/components/mealPlan/MealDisplay';
import { UIDayPlan, isDayEmpty } from './PlannerUtils';
import { NoMealsForDay } from './NoMealsForDay';
import { PastDayState } from './PastDayState';
import { TodayPlanningState } from './TodayPlanningState';

export type DayType = 'past' | 'today' | 'future';

interface DailyMealListProps {
    dayMeals: UIDayPlan;
    onMealClick: (mealId: string, imageUrl?: string) => void;
    dayType?: DayType;
}

/**
 * Component to display the list of meals for a specific day.
 * Renders Breakfast, Lunch, and Dinner sections.
 * Shows contextual empty states based on dayType when no meals are present.
 */
export const DailyMealList: React.FC<DailyMealListProps> = ({
    dayMeals,
    onMealClick,
    dayType = 'future',
}) => {
    // Check if the plan is completely empty for the day
    if (isDayEmpty(dayMeals)) {
        // Render contextual empty state based on day type
        switch (dayType) {
            case 'past':
                return <PastDayState />;
            case 'today':
                return <TodayPlanningState />;
            case 'future':
            default:
                return <NoMealsForDay />;
        }
    }

    const renderMealSection = (mealType: string, meals: any[]) => {
        return (
            <MealDisplay
                mealType={mealType}
                meals={meals}
                viewMode="daily"
                onMealClick={onMealClick}
            />
        );
    };

    return (
        <div className="space-y-4 lg:space-y-8">
            {/* Breakfast Section */}
            {renderMealSection('breakfast', dayMeals.breakfast)}

            {/* Lunch Section */}
            {renderMealSection('lunch', dayMeals.lunch)}

            {/* Dinner Section */}
            {renderMealSection('dinner', dayMeals.dinner)}
        </div>
    );
};
