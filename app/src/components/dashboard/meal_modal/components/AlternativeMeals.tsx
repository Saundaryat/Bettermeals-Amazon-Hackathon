import React from 'react';
import { MealDetails } from "../types";
import { useAlternativeMeals } from "@/hooks/useAlternativeMeals";

interface AlternativeMealsProps {
    mealId: string;
    onSelectAlternative: (meal: MealDetails) => void;
}

export const AlternativeMeals: React.FC<AlternativeMealsProps> = ({ mealId, onSelectAlternative }) => {
    const { data: alternatives, isLoading } = useAlternativeMeals(mealId);

    if (isLoading) {
        return (
            <div className="mt-8">
                <h3 className="font-semibold mb-2">Alternative Meals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!alternatives || alternatives.length === 0) {
        return null; // Or show a message "No alternatives found"
    }

    return (
        <div className="mt-8">
            <h3 className="font-semibold mb-2">Alternative Meals</h3>
            <p className="text-gray-500 mb-4 text-xs">Don't like this meal? Swap it with one of these similar options.</p>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {alternatives.map((altMeal, index) => (
                    <div
                        key={altMeal.meal_id || index}
                        className="group cursor-pointer flex-none w-48"
                        onClick={() => onSelectAlternative(altMeal)}
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden relative mb-3 bg-gray-100">
                            <img
                                src={altMeal.imageUrlThumb || altMeal.imageUrlMid || altMeal.imageUrl}
                                alt={altMeal.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>

                        <div className="px-1 text-center">
                            <h4 className="font-medium text-gray-900 mb-2 truncate" title={altMeal.name}>{altMeal.name}</h4>

                            <button
                                className="w-full py-2 bg-[#f7e6cf]/80 hover:bg-[#f0d9b8] text-black rounded-lg text-xs font-medium transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectAlternative(altMeal);
                                }}
                            >
                                Swap
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
