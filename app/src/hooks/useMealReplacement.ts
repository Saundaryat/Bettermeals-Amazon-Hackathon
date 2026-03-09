import { MealDetails } from "@/components/dashboard/meal_modal/types";
import { Meal } from "@/services/types";
import { WeeklyMealPlanResponse } from "@/services/types";
import { fetchMealDetails } from "@/services/database";

interface UseMealReplacementProps {
    householdId?: string;
    user: any; // Using any for now to match usage, ideally strict User type
    weeklyMealPlan: WeeklyMealPlanResponse | undefined;
    selectedMealId: string | null;
    forNextWeek: boolean;
    updateWeeklyMealPlan: (variables: { householdId: string, forNextWeek: boolean, plan: any, userId: string }) => void;
    onSuccess?: () => void;
}

export function useMealReplacement({
    householdId,
    user,
    weeklyMealPlan,
    selectedMealId,
    forNextWeek,
    updateWeeklyMealPlan,
    onSuccess
}: UseMealReplacementProps) {

    const handleReplaceMeal = async (newMealDetails: MealDetails) => {
        if (!householdId || !user?.user_id || !weeklyMealPlan?.weekly_meal_plan || !selectedMealId) return;

        let foundDayString: string | null = null;
        let foundSlot: string | null = null;
        let foundIndex: number = -1;

        // Search for the meal in the current plan to find its day, slot, and index
        const mealsMap = weeklyMealPlan.weekly_meal_plan.meals;

        // Efficiently search for the meal across all days and slots
        // entry: [day, slots] where slots is Record<string, Meal[]>
        for (const [day, slots] of Object.entries(mealsMap)) {
            if (!slots) continue;

            for (const [slotName, meals] of Object.entries(slots)) {
                if (!Array.isArray(meals)) continue;

                const idx = meals.findIndex(m => m.meal_id === selectedMealId);
                if (idx !== -1) {
                    foundDayString = day;
                    foundSlot = slotName;
                    foundIndex = idx;
                    break; // Found the meal, stop searching
                }
            }
            if (foundDayString) break;
        }

        if (foundDayString && foundSlot && foundIndex !== -1) {
            try {
                // Fetch full details for the new meal to ensure we have ingredients, steps, etc.
                const fullMealDetails = await fetchMealDetails(newMealDetails.meal_id || "");

                // Clone the slots for the specific day
                const currentSlots = mealsMap[foundDayString!] || {};
                const updatedSlots = { ...currentSlots };

                // Clone the meals array for the specific slot
                const currentMeals = updatedSlots[foundSlot!] || [];
                const updatedMeals = [...currentMeals];

                const oldMeal = updatedMeals[foundIndex];

                // Construct a new Meal object from the fetched full details
                const newMeal: Meal = {
                    meal_id: fullMealDetails.meal_id || newMealDetails.meal_id || `temp_${Date.now()}`,
                    name: fullMealDetails.name,
                    recipe: fullMealDetails.originalRecipeLink || "",
                    notes: fullMealDetails.description || "",
                    household_score: 0,
                    media: {
                        image_url: fullMealDetails.imageUrl || "",
                        video: "",
                        image_url_medium: fullMealDetails.imageUrlMid || fullMealDetails.imageUrl || "",
                        image_url_thumbnail: fullMealDetails.imageUrlThumb || fullMealDetails.imageUrl || ""
                    },
                    meal_tags: {
                        macro: fullMealDetails.meal_tags?.macro || [],
                        micronutrient: fullMealDetails.meal_tags?.micronutrient || [],
                        functional: fullMealDetails.meal_tags?.functional || [],
                        diet_lifestyle: fullMealDetails.meal_tags?.diet_lifestyle || []
                    },
                    // Retain original meal type if possible, or default
                    meal_type: oldMeal.meal_type,
                    sides: oldMeal.sides,
                    // Retain dish_type and slot_id from the meal being replaced to maintain structure
                    dish_type: oldMeal.dish_type,
                    slot_id: oldMeal.slot_id
                };

                updatedMeals[foundIndex] = newMeal;
                updatedSlots[foundSlot!] = updatedMeals;

                // Construct the updated plan object
                const updatedPlan = {
                    ...weeklyMealPlan.weekly_meal_plan,
                    meals: {
                        ...mealsMap,
                        [foundDayString!]: updatedSlots
                    }
                };

                // Call mutation to save
                updateWeeklyMealPlan({
                    householdId,
                    forNextWeek,
                    plan: updatedPlan,
                    userId: user.user_id
                });

                if (onSuccess) {
                    onSuccess();
                }
            } catch (error) {
                console.error("Failed to fetch full meal details for replacement:", error);
                // Optionally handle error UI feedback here
            }
        }
    };

    return { handleReplaceMeal };
}
