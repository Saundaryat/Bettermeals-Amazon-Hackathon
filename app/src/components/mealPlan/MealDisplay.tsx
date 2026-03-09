import React from "react";
import { Utensils, Edit2 } from "lucide-react";

export interface UIMeal {
  name: string;
  meal_id: string;
  image: string;
  image_medium?: string;
  image_thumbnail?: string;
  tags: string[];
  dish_type?: string;
  user_name?: string;
}

interface MealDisplayProps {
  mealType: string;
  meals: UIMeal[];
  viewMode: 'daily' | 'weekly';
  onMealClick?: (mealId: string, imageUrl?: string) => void;
  mealImages?: { [mealId: string]: string };
  mealImagesThumbnail?: { [mealId: string]: string };
  mealImagesMedium?: { [mealId: string]: string };
  alternateMeals?: any[];
  alternateSides?: any[];
  variants?: any[];
  onSelectAlternate?: (selectedId: string, oldDishId: string) => void;
  dayKey?: string;
}

import { PLACEHOLDER_IMAGE_URL } from '@/utils/imageUrl';

export const MealDisplay: React.FC<MealDisplayProps> = ({
  mealType,
  meals,
  viewMode,
  onMealClick,
  mealImages = {},
  mealImagesThumbnail = {},
  mealImagesMedium = {},
  alternateMeals = [],
  alternateSides = [],
  variants = [],
  onSelectAlternate,
  dayKey = ''
}) => {
  if (!meals || meals.length === 0) {
    return null;
  }

  // Standard grid layout for both view modes
  return (
    <div className="mb-6 lg:mb-8">
      {/* Meal Type Header */}
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="bg-[#51754f]/10 p-2 rounded-lg">
          <Utensils size={20} className="text-[#51754f]" />
        </div>
        <span className="text-xl lg:text-2xl font-bold text-gray-900 capitalize tracking-tight">{mealType}</span>
      </div>

      {/* Unified Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {meals.map((meal, index) => (
          <div
            key={`${meal.meal_id}_${mealType}_${index}`}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-row items-center gap-4 relative"
            onClick={() => onMealClick?.(meal.meal_id, meal.image_medium || meal.image)}
          >
            {/* Image */}
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={mealImages[meal.meal_id] || meal.image_thumbnail || meal.image || PLACEHOLDER_IMAGE_URL}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 pr-8">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-base lg:text-lg leading-tight group-hover:text-[#51754f] transition-colors line-clamp-2">
                  {meal.name}
                </h3>
                {meal.dish_type === 'ADDON' && meal.user_name && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider w-fit bg-[#51754f]/10 text-[#51754f]">
                    {`For ${meal.user_name}`}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-1">
                {meal.tags.slice(0, 5).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-semibold rounded-md border border-gray-200 transition-colors uppercase tracking-tight"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Button */}
            <button
              className="absolute top-4 right-4 p-2 text-gray-300 hover:text-[#51754f] hover:bg-[#51754f]/10 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                onMealClick?.(meal.meal_id, meal.image_medium || meal.image);
              }}
              aria-label="Edit meal"
            >
              <Edit2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

