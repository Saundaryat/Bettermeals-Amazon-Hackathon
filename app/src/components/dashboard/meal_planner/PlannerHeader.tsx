import React from 'react';
import { Loader2 } from 'lucide-react';

interface PlannerHeaderProps {
    hasRealMealPlan: boolean;
    imagesPreloaded: boolean;
    preloadProgress: {
        loaded: number;
        total: number;
    };
    onApprove?: () => void;
    isApproving?: boolean;
    isApproved?: boolean;
}

/**
 * Header component for the Planner.
 * Displays the title and an optional image preload indicator.
 */
export const PlannerHeader: React.FC<PlannerHeaderProps> = ({
    hasRealMealPlan,
    imagesPreloaded,
    preloadProgress,
    onApprove,
    isApproving,
    isApproved
}) => {
    return (
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Left Content: Title, Subtitle, Loader */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">Weekly Meal Planner</h1>
                <div className="flex items-center gap-3 text-black/70 text-sm lg:text-base">
                    <p>Your personalized meal plan for the week</p>
                    {/* Image preload indicator */}
                    {hasRealMealPlan && !imagesPreloaded && preloadProgress.total > 0 && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500 border-l pl-3 border-gray-300">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Loading images... {preloadProgress.loaded}/{preloadProgress.total}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Content: Action Button */}
            {/* Right Content: Action Button */}
            {/* {onApprove && hasRealMealPlan && (
                <div className="flex-shrink-0">
                    <button
                        onClick={onApprove}
                        disabled={isApproving || isApproved}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs md:text-sm lg:text-base lg:px-10 lg:py-2.5 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${isApproved
                            ? "bg-gray-100 text-gray-500"
                            : "bg-[#f7e6cf] text-black hover:bg-[#f7e6cf]/60"
                            }`}
                    >
                        {isApproving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-900 border-r-2 border-transparent"></div>
                        )}
                        <span>{isApproving ? 'Approving...' : isApproved ? 'Plan Approved' : 'Approve Plan'}</span>
                    </button>
                </div>
            )} */}
        </div>
    );
};
