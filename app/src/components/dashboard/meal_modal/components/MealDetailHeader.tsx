import React from 'react';
import { X } from "lucide-react";
import { MealDetails } from "../types";

interface MealDetailHeaderProps {
    mealDetails: MealDetails | null;
    loading: boolean;
    onClose: () => void;
}

export const MealDetailHeader: React.FC<MealDetailHeaderProps> = ({ mealDetails, loading, onClose }) => {
    return (
        <div className="relative p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 lg:top-4 lg:right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                aria-label="Close"
            >
                <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
            </button>

            {loading ? (
                <div className="animate-pulse">
                    <div className="h-6 lg:h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            ) : mealDetails ? (
                <div className="pr-8 lg:pr-0">
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">{mealDetails.name}</h1>
                    {mealDetails.author && (
                        <div className="hidden lg:flex items-center gap-2 text-sm lg:text-base text-gray-600">
                            <span>By {mealDetails.author}</span>
                            {mealDetails.originalRecipeLink && (
                                <a
                                    href={mealDetails.originalRecipeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Original Recipe Link
                                </a>
                            )}
                        </div>
                    )}
                    {mealDetails.description && (
                        <p className="hidden lg:block text-sm lg:text-base text-gray-700 mt-1 lg:mt-2">{mealDetails.description}</p>
                    )}
                </div>
            ) : null}
        </div>
    );
};
