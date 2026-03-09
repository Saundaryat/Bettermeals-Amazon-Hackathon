import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { mealPlanStyles } from "@/pages/styles/SharedPageStyles";
import { DayNavigationBar } from "./DayNavigationBar";
import { MealDisplay } from "./MealDisplay";
import { EmptyDayState } from "./EmptyDayState";

const ORDERED_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Reusable list of meal times to avoid repetitive JSX blocks
const MEAL_TIMES = ["breakfast", "lunch", "dinner"] as const;

interface MealPlanCarouselProps {
  mealPlanData: any;
  mealImages: { [mealId: string]: string };
  mealImagesThumbnail: { [mealId: string]: string };
  mealImagesMedium: { [mealId: string]: string };
  current: number;
  weekOffset: number;
  scrollTo: (index: number) => void;
  setApi: (api: any) => void;
  // Handler invoked when a user selects an alternate dish.
  // The additional optional `oldDishId` parameter allows callers to know which dish is being replaced.
  onSelectAlternate: (
    dayKey: string,
    mealTime: string,
    selectedId: string,
    oldDishId?: string
  ) => void | Promise<void>;
}

// Helper function to get meal details
const getMealDetails = (mealDetails: any, mealIds: string[]) => {
  return mealIds.map(id => mealDetails[id]).filter(Boolean);
};


export const MealPlanCarousel: React.FC<MealPlanCarouselProps> = ({
  mealPlanData,
  mealImages,
  mealImagesThumbnail,
  mealImagesMedium,
  current,
  scrollTo,
  setApi,
  onSelectAlternate,
  weekOffset,
}) => {
  return (
    <Carousel
      className={mealPlanStyles.carousel}
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {ORDERED_DAYS.map((day) => {
          // New data structure: meals are in meals array, addons are in addons object
          const dayMeals = mealPlanData.meals?.[day] || [];
          const dayAddons = mealPlanData.addons?.[day] || {};

          // Debug the data structure
          console.log(`Processing day: ${day}`);
          console.log('dayMeals:', dayMeals);
          console.log('dayAddons:', dayAddons);

          return (
            <CarouselItem key={day}>
              <div className={mealPlanStyles.carouselItem}>
                <DayNavigationBar current={current} scrollTo={scrollTo} weekOffset={weekOffset} />

                {!dayMeals || dayMeals.length === 0 ? (
                  <EmptyDayState />
                ) : (
                  <div className={mealPlanStyles.dayContent}>
                    {MEAL_TIMES.map((mealTime, mealTimeIndex) => {
                      // Use array index to get meals: 0=breakfast, 1=lunch, 2=dinner
                      const mealForTime = dayMeals[mealTimeIndex];

                      if (!mealForTime) return null;

                      // Get addons for this meal time
                      const addonsForTime = dayAddons[mealTime] || {};
                      const addonList = Object.values(addonsForTime);

                      // Ensure we have an array of meals for this slot
                      const mealsInSlot = Array.isArray(mealForTime) ? mealForTime : [mealForTime];

                      // Transform meal data to match MealDisplay format
                      const transformedMeals = [
                        ...mealsInSlot.filter(Boolean).map((meal: any) => ({
                          meal_id: meal.meal_id || meal.id || `meal_${meal.name?.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
                          name: meal.name,
                          image: meal.media?.image_url || "",
                          tags: meal.meal_tags ? [
                            ...(meal.meal_tags.macro || []),
                            ...(meal.meal_tags.micronutrient || []),
                            ...(meal.meal_tags.functional || []),
                            ...(meal.meal_tags.diet_lifestyle || [])
                          ] : [],
                          notes: meal.notes || "",
                          recipe: meal.recipe || "",
                          dish_type: meal.dish_type || (mealTimeIndex === 0 ? 'STANDALONE' : 'PRIMARY')
                        })),
                        ...addonList.map((addon: any) => ({
                          meal_id: addon.addon_id || addon.id,
                          name: addon.name,
                          image: addon.media?.image_url || "",
                          tags: addon.meal_tags ? [
                            ...(addon.meal_tags.macro || []),
                            ...(addon.meal_tags.micronutrient || []),
                            ...(addon.meal_tags.functional || []),
                            ...(addon.meal_tags.diet_lifestyle || [])
                          ] : [],
                          notes: addon.notes || "",
                          recipe: addon.recipe || "",
                          dish_type: 'ADDON'
                        }))
                      ];

                      return (
                        <MealDisplay
                          key={mealTime}
                          mealType={mealTime}
                          meals={transformedMeals}
                          viewMode="weekly"
                          mealImages={mealImages}
                          mealImagesThumbnail={mealImagesThumbnail}
                          mealImagesMedium={mealImagesMedium}
                          alternateMeals={[]}
                          alternateSides={[]}
                          variants={[]}
                          onSelectAlternate={(selectedId: string, oldDishId: string) => {
                            onSelectAlternate(day, mealTime, selectedId, oldDishId);
                          }}
                          dayKey={day}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Desktop Navigation Buttons */}
      {/* <CarouselPrevious className={mealPlanStyles.carouselPrevious} /> */}
      {/* <CarouselNext className={mealPlanStyles.carouselNext} /> */}
    </Carousel>
  );
}; 