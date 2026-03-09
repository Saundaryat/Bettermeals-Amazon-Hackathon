import React from 'react';
import { Utensils, BarChart2 } from 'lucide-react';

interface WeeklyViewToggleProps {
    view: 'meals' | 'insights';
    onViewChange: (view: 'meals' | 'insights') => void;
}

export const WeeklyViewToggle: React.FC<WeeklyViewToggleProps> = ({
    view,
    onViewChange
}) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-6">
            <button
                onClick={() => onViewChange('meals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'meals'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                    }`}
            >
                <Utensils size={16} />
                <span>Meals</span>
            </button>
            <button
                onClick={() => onViewChange('insights')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'insights'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                    }`}
            >
                <BarChart2 size={16} />
                <span>Insights</span>
            </button>
        </div>
    );
};
