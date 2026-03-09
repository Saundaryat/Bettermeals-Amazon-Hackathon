import React from 'react';
import { Utensils } from 'lucide-react';
import { MacroData } from '@/services/insightsTypes';

interface DailyMacroTargetsCardProps {
    macros: {
        calories?: MacroData;
        energy_kcal?: MacroData;
        protein: MacroData;
        carbs: MacroData;
        fats: MacroData;
        fiber: MacroData;
    };
}

export const DailyMacroTargetsCard: React.FC<DailyMacroTargetsCardProps> = ({ macros }) => {
    // Helper to calculate percentage if not provided
    const getPercentage = (current: number, target: number) => {
        if (!target) return 0;
        return Math.round((current / target) * 100);
    };

    // Derived calories if not provided
    // Priority: explicit 'calories' key -> 'energy_kcal' key -> calculation
    const caloriesData = macros.calories || macros.energy_kcal || {
        current: Math.round((macros.protein.current * 4) + (macros.carbs.current * 4) + (macros.fats.current * 9)),
        target: Math.round((macros.protein.target * 4) + (macros.carbs.target * 4) + (macros.fats.target * 9)),
        unit: 'kcal'
    };

    return (
        <div className="bg-white rounded-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7e6cf]">
                    <Utensils className="w-4 h-4 text-[#51754f]" />
                </div> */}
                <h3 className="text-xl font-bold text-gray-900">Daily Macro Targets</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center relative z-10">
                <CircularMacroItem
                    label="Calories"
                    {...caloriesData}
                    percentage={caloriesData.percent_of_target ?? getPercentage(caloriesData.current, caloriesData.target)}
                />
                <CircularMacroItem
                    label="Protein"
                    {...macros.protein}
                    percentage={macros.protein.percent_of_target ?? getPercentage(macros.protein.current, macros.protein.target)}
                />
                <CircularMacroItem
                    label="Carbs"
                    {...macros.carbs}
                    percentage={macros.carbs.percent_of_target ?? getPercentage(macros.carbs.current, macros.carbs.target)}
                />
                <CircularMacroItem
                    label="Fiber"
                    {...macros.fiber}
                    percentage={macros.fiber.percent_of_target ?? getPercentage(macros.fiber.current, macros.fiber.target)}
                />
                <CircularMacroItem
                    label="Fats"
                    {...macros.fats}
                    percentage={macros.fats.percent_of_target ?? getPercentage(macros.fats.current, macros.fats.target)}
                />
            </div>
        </div>
    );
};

interface CircularMacroItemProps {
    label: string;
    current: number;
    unit: string;
    percentage: number;
}

const CircularMacroItem: React.FC<CircularMacroItemProps> = ({ label, current, unit, percentage }) => {
    const radius = 58; // Significantly larger
    const strokeWidth = 15; // Proportional thickness
    const size = 160;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    // Clamp visual progress to 100%
    const visualPercentage = Math.min(percentage, 100);
    const strokeDashoffset = circumference - (visualPercentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center" role="progressbar" aria-valuenow={visualPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}>
                <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm" aria-hidden="true">
                    {/* Background Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        className="text-[#f3f4f4]"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        stroke="currentColor"
                    />

                    {/* Progress Circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#51754f"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Text in center */}
                <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
                    <span className="font-medium text-gray-600 text-sm tracking-tight">{label}</span>
                    <span className="font-bold text-lg leading-none text-gray-900">
                        {current}<span className="text-[10px] font-medium text-gray-400 ml-0.5">{unit}</span>
                    </span>
                    <span className="text-[9px] font-medium text-gray-400 mt-1">{percentage}% RDA</span>
                </div>
            </div>
        </div>
    );
};
