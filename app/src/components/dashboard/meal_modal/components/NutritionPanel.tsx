import React from 'react';
import { MealDetails } from "../types";

interface NutritionPanelProps {
    mealDetails: MealDetails;
}

export const NutritionPanel: React.FC<NutritionPanelProps> = ({ mealDetails }) => {
    return (
        <div className="md:py-2">
            <h3 className="font-semibold text-gray-900 mb-4">Nutritional Information</h3>
            <div className="grid grid-cols-4 gap-2 md:gap-6">
                <div className="flex flex-col">
                    <span className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Calories</span>
                    <div className="mt-1 flex flex-col xl:flex-row xl:items-baseline gap-0 md:gap-1">
                        <span className="text-base md:text-2xl font-bold text-gray-900">{mealDetails.calories || 450}</span>
                        <span className="text-[8px] md:text-xs text-gray-500">kcal</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Protein</span>
                    <div className="mt-1 flex flex-col xl:flex-row xl:items-baseline gap-0 md:gap-1">
                        <span className="text-base md:text-2xl font-bold text-gray-900">{mealDetails.protein || 12}g</span>
                        <span className="text-[8px] md:text-xs text-emerald-600 font-medium">24% DV</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Carbs</span>
                    <div className="mt-1 flex flex-col xl:flex-row xl:items-baseline gap-0 md:gap-1">
                        <span className="text-base md:text-2xl font-bold text-gray-900">{mealDetails.carbs || 65}g</span>
                        <span className="text-[8px] md:text-xs text-gray-500">24% DV</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider font-medium">Fats</span>
                    <div className="mt-1 flex flex-col xl:flex-row xl:items-baseline gap-0 md:gap-1">
                        <span className="text-base md:text-2xl font-bold text-gray-900">{mealDetails.fats || 15}g</span>
                        <span className="text-[8px] md:text-xs text-gray-500">19% DV</span>
                    </div>
                </div>
            </div>
            <p className="hidden md:block text-[10px] text-gray-400 mt-2">
                *Percent daily values are based on a 2,000 calorie diet, the Indian national average.
            </p>
        </div>
    );
};
