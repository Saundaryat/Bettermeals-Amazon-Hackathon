import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface NoMealsForDayProps {
    message?: string;
}

export const NoMealsForDay: React.FC<NoMealsForDayProps> = ({
    message = "No meals scheduled for this day."
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center bg-gray-50 rounded-xl border border-gray-100 min-h-[300px]">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <UtensilsCrossed className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bon Appétit (Elsewhere)!</h3>
            <p className="text-gray-600 max-w-xs mx-auto">
                {message}
            </p>
        </div>
    );
};
