import React, { useEffect } from "react";
import { useMealDetails } from "./useMealDetails";
import { MealDetailModalProps } from "./types";
import { MealDetailHeader } from "./components/MealDetailHeader";
import { MealImage } from "./components/MealImage";
import { MealStats } from "./components/MealStats";
import { NutritionPanel } from "./components/NutritionPanel";
import { IngredientsGrid } from "./components/IngredientsGrid";
import { CookingStepsList } from "./components/CookingStepsList";
import { AlternativeMeals } from "./components/AlternativeMeals";
import { useIngredientImagePreloading } from "@/hooks/useIngredientImagePreloading";

export default function MealDetailModal({ isOpen, mealId, onClose, initialImageUrl, onReplaceMeal, mealPlanData, addonsData, imagesPreloaded }: MealDetailModalProps) {
  const { mealDetails, loading, error, refetch } = useMealDetails(mealId, isOpen);

  // Preload ingredient images when modal opens
  useIngredientImagePreloading({
    mealId,
    isOpen,
    mealPlanData,
    addonsData,
    imagesPreloaded
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scrolling when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Prevent click events from propagating to background
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Creates the dark, semi-transparent background behind the modal.
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm p-0 lg:p-4"
      onClick={handleOverlayClick}
    >
      {/* This is the actual white box containing the meal info. */}
      <div
        className="bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] lg:h-auto lg:max-h-[95vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y' }}
      >
        <MealDetailHeader
          mealDetails={mealDetails}
          loading={loading}
          onClose={onClose}
        />
        {/* Controls how the Image and Details are positioned. */}
        {/* Content - Scrollable container on mobile, fixed on desktop */}
        <div
          className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden min-h-0 overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          {/* Left side - Image */}
          <MealImage
            mealDetails={mealDetails}
            loading={loading}
            initialImageUrl={initialImageUrl}
          />

          {/* Right side - Details - Scrollable on desktop only */}
          <div className="lg:w-1/2 p-4 lg:p-6 lg:overflow-y-auto lg:flex-1 lg:min-h-0 lg:overscroll-contain">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : mealDetails ? (
              <div className="space-y-6 pb-8">
                {/* Details Section */}
                <MealStats mealDetails={mealDetails} />

                {/* Nutritional Information */}
                <NutritionPanel mealDetails={mealDetails} />

                {/* Alternative Meals */}
                {onReplaceMeal && (
                  <AlternativeMeals
                    mealId={mealDetails.meal_id || mealId}
                    onSelectAlternative={onReplaceMeal}
                  />
                )}

                {/* Ingredients Section */}
                <IngredientsGrid ingredients={mealDetails.ingredients} />

                {/* Cooking Steps Section */}
                <CookingStepsList cookingSteps={mealDetails.cookingSteps} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
