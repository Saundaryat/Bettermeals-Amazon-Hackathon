import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Component to display when viewing a past day where no meal was planned.
 * Used for days before the meal plan was generated (e.g., Monday/Tuesday
 * when plan was generated on Wednesday).
 */
export const PastDayState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center bg-gray-50 rounded-xl border border-gray-100 min-h-[300px]">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">This day has passed</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
                No meals were planned for this day. Meal plans are generated for upcoming days.
            </p>
        </div>
    );
};
