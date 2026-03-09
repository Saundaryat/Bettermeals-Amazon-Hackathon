import React from 'react';
import { MealDetails } from "../types";

interface CookingStepsListProps {
    cookingSteps: MealDetails['cookingSteps'];
}

export const CookingStepsList: React.FC<CookingStepsListProps> = ({ cookingSteps }) => {
    if (!cookingSteps) return null;

    return (
        <div className="pb-10 md:pb-0">
            <h3 className="font-semibold mb-3">Recipe</h3>
            <div className="space-y-3">
                <div className="flex gap-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{cookingSteps}</p>
                </div>
            </div>
        </div>
    );
};
