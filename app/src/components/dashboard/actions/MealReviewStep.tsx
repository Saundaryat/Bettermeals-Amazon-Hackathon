import React from 'react';
import { WeeklyPlannerView } from '@/components/dashboard/meal_planner/WeeklyPlannerView';
import { WorkflowActionFooter } from './WorkflowActionFooter';

interface MealReviewStepProps {
    selectedDay: number;
    onDayChange: (day: number) => void;
    nextWeekStart: Date;
    currentDayMeals: any;
    onMealClick: (mealId: string, imageUrl?: string) => void;
    onApprove: () => void;
    isApproving: boolean;
}

export function MealReviewStep({
    selectedDay,
    onDayChange,
    nextWeekStart,
    currentDayMeals,
    onMealClick,
    onApprove,
    isApproving
}: MealReviewStepProps) {
    return (
        <div className="pb-36 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-sm border border-gray-100">
                <WeeklyPlannerView
                    selectedDay={selectedDay}
                    onDayChange={onDayChange}
                    startDate={nextWeekStart}
                    currentDayMeals={currentDayMeals}
                    onMealClick={onMealClick}
                />
            </div>

            <WorkflowActionFooter
                onPrimary={onApprove}
                primaryLabel={isApproving ? 'Approving...' : 'Approve Weekly Plan'}
                isPrimaryDisabled={isApproving}
            />
        </div>
    );
}
