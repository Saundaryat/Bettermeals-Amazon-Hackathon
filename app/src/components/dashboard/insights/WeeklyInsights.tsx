import React from 'react';
import { format } from 'date-fns';
import { WeeklyInsightsData } from '@/services/insightsTypes';
import { DailyMacroTargetsCard } from './DailyMacroTargetsCard';
import { KeyMicronutrientsCard } from './KeyMicronutrientsCard';
import { ClinicalFocusCard } from './ClinicalFocusCard';

interface WeeklyInsightsProps {
    selectedDate?: Date;
    insightsData?: WeeklyInsightsData;
}

export const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({ selectedDate, insightsData }) => {
    // Get day name in lowercase (e.g., 'monday') to key into data
    const dayKey = selectedDate ? format(selectedDate, 'EEEE').toLowerCase() : 'monday';
    const dayData = insightsData?.[dayKey];

    if (!dayData) {
        return (
            <div className="w-full p-6 text-center text-gray-500 bg-gray-50 rounded-2xl">
                No insights data available for this day.
            </div>
        );
    }

    const { macros, key_micronutrients, clinical_matching } = dayData;

    return (
        <div className="w-full space-y-4 mb-6">
            <DailyMacroTargetsCard macros={macros} />
            <ClinicalFocusCard
                clinical_matching={clinical_matching}
                profile_context={dayData.profile_context}
            />
            <KeyMicronutrientsCard key_micronutrients={key_micronutrients} />
        </div>
    );
};
