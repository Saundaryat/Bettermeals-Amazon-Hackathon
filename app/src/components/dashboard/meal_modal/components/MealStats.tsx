import React from 'react';
import { Clock, Users, IndianRupee } from "lucide-react";
import { MealDetails } from "../types";

interface MealStatsProps {
    mealDetails: MealDetails;
}


const DEFAULT_STATS = {
    skillLevel: 'Medium',
    cookTime: 15,
    servings: 1,
    servingSize: '1 plate',
    estimatedCost: '₹50-60'
};

export const MealStats: React.FC<MealStatsProps> = ({ mealDetails }) => {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Skill:</span>
                <span className="text-gray-900">{mealDetails.skillLevel || DEFAULT_STATS.skillLevel}</span>
            </div>

            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Time:</span>
                <span className="text-gray-900">{mealDetails.cookTime || DEFAULT_STATS.cookTime} mins</span>
            </div>

            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Servings:</span>
                <span className="text-gray-900">{mealDetails.servings || DEFAULT_STATS.servings}</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-gray-500">Serving Size:</span>
                <span className="text-gray-900">{mealDetails.servingSize || DEFAULT_STATS.servingSize}</span>
            </div>

            <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Cost:</span>
                <span className="text-gray-900">{mealDetails.estimatedCost || DEFAULT_STATS.estimatedCost}</span>
            </div>
        </div>
    );
};
