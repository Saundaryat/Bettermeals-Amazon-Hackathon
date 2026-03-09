import React from 'react';
import { Sunrise } from 'lucide-react';

/**
 * Component to display on the current day when meal plans start from tomorrow.
 * Explains to the user why today doesn't have meals - giving them time to
 * order groceries and finish any leftovers.
 */
export const TodayPlanningState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center bg-amber-50 rounded-xl border border-amber-100 min-h-[300px]">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Sunrise className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your meal plan starts tomorrow</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
                This gives you time to order groceries and finish any leftovers. Your delicious meals await!
            </p>
        </div>
    );
};
