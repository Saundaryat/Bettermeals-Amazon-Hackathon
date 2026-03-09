import React from 'react';
import { Utensils, Plus, Loader2 } from 'lucide-react';

interface EmptyMealPlanStateProps {
    isGenerating: boolean;
    generationError: string | null;
    onGenerate: () => void;
}

/**
 * Component to display when no meal plan is available.
 * Shows a call-to-action to generate a new meal plan.
 */
export const EmptyMealPlanState: React.FC<EmptyMealPlanStateProps> = ({
    isGenerating,
    generationError,
    onGenerate,
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            <div className="bg-gray-50 rounded-2xl p-6 lg:p-12 max-w-md w-full">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                    <Utensils className="w-6 h-6 lg:w-8 lg:h-8 text-gray-500" />
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold text-black mb-4">No Meal Plan Available</h2>
                <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base">
                    Generate your personalized weekly meal plan based on your household preferences and dietary requirements.
                </p>

                {generationError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{generationError}</p>
                    </div>
                )}

                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full bg-[#f7e6cf] hover:bg-[#f0d9b8] disabled:bg-gray-300 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Meal Plan...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Generate Meal Plan</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
