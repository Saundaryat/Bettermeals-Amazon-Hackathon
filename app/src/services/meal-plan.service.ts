import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////////// Meal Plan ///////////////
/////////////////////////////////////

/**
 * Fetch the merged weekly meal plan for a household from the backend
 */
/**
 * Fetch the merged weekly meal plan for a household from the backend
 */
export async function fetchHouseholdWeeklyMealPlan(householdId: string, forNextWeek: boolean = false) {
    if (!householdId) {
        throw new Error('Household ID is required');
    }

    try {
        const endpoint = `/household/household-weekly-meal-plan/${householdId}?for_next_week=${forNextWeek}`;
        const result = await api.get(endpoint, {
            requireAuth: true
        });


        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch household weekly meal plan');
        }

        return result.data;
    } catch (error) {
        console.error('Error in fetchHouseholdWeeklyMealPlan:', error);
        throw new Error('Could not fetch household weekly meal plan.');
    }
}

export const logMealUpdateTransaction = async (
    householdId: string,
    yearWeek: string,
    dayKey: string,
    mealTime: string,
    oldMealId: string,
    newMealId: string,
    userId: string
) => {
    try {
        const result = await api.post('/audit/meal-update-transaction', {
            household_id: householdId,
            year_week: yearWeek,
            day_key: dayKey,
            meal_time: mealTime,
            old_meal_id: oldMealId,
            new_meal_id: newMealId,
            user_id: userId,
        }, { requireAuth: true });

        if (!result.success) {
            throw new Error(result.error || 'Failed to log meal update transaction');
        }
        return result.data;
    } catch (error) {
        console.error('Error in logMealUpdateTransaction:', error);
        throw new Error('Could not log meal update transaction.');
    }
};

export const saveWeeklyMealPlan = async (
    householdId: string,
    forNextWeek: boolean,
    weeklyPlan: any,
    userId: string
) => {
    try {
        const result = await api.post('/household/household-weekly-meal-plan', {
            household_id: householdId,
            for_next_week: forNextWeek,
            weekly_plan: weeklyPlan,
            user_id: userId,
        }, { requireAuth: true });

        if (!result.success) {
            throw new Error(result.error || 'Failed to save weekly meal plan');
        }
        return result.data;
    } catch (error) {
        console.error('Error in saveWeeklyMealPlan:', error);
        throw new Error('Could not save weekly meal plan.');
    }
};

/**
 * Generate a new weekly meal plan for a household
 */
export const generateWeeklyMealPlan = async (
    householdId: string,
    forNextWeek: boolean
) => {
    try {
        const endpoint = `/household/generate-weekly-meal-plan/${householdId}?for_next_week=${forNextWeek}`;
        const result = await api.post(endpoint, {}, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to generate weekly meal plan');
        }

        return result.data;
    } catch (error) {
        console.error('Error in generateWeeklyMealPlan:', error);
        throw new Error('Could not generate weekly meal plan.');
    }
};

/**
 * Fetch detailed meal information by meal ID
 */
export const fetchMealDetails = async (mealId: string) => {
    if (!mealId) {
        throw new Error('Meal ID is required');
    }


    try {
        const endpoint = `/dashboard/meal/${mealId}`;

        const result = await api.get(endpoint, {
            requireAuth: true
        });


        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch meal details');
        }

        // Map API response to expected interface structure
        const apiData = result.data;
        const mappedData = {
            name: apiData.name || apiData.dish_name || `Meal ${mealId}`,
            author: apiData.author || "Chef Saxena",
            originalRecipeLink: apiData.originalRecipeLink || apiData.recipe_link,
            description: apiData.description || apiData.notes || apiData.recipe,
            skillLevel: apiData.skillLevel || apiData.skill_level || "Medium",
            cookTime: apiData.cookTime || apiData.cook_time || apiData.prep_time || 12,
            servings: apiData.servings || apiData.serving_size || 1,
            servingSize: apiData.servingSize || apiData.serving_size || "1 plate",
            estimatedCost: apiData.estimatedCost || apiData.estimated_cost || "₹50-60",
            calories: Math.round(apiData.nutrient?.nutrients_computed?.energy_kcal || apiData.calories || apiData.macros?.calories || 450),
            carbs: Math.round(apiData.nutrient?.nutrients_computed?.carbs_g || apiData.carbs || apiData.macros?.carbs || 65),
            protein: Math.round(apiData.nutrient?.nutrients_computed?.protein_g || apiData.protein || apiData.macros?.protein || 12),
            fats: Math.round(apiData.nutrient?.nutrients_computed?.fat_g || apiData.fats || apiData.macros?.fat || apiData.macros?.fats || 15),
            dailyDietPercentage: apiData.dailyDietPercentage || apiData.daily_diet_percentage || 22,
            ingredients: apiData.ingredients || [],
            cookingSteps: apiData.recipe || apiData.notes || "",
            imageUrl: apiData.imageUrl || apiData.image_url || apiData.media?.image_url || apiData.media?.imageurl || "",
            imageUrlThumb: apiData.image_url_thumbnail || apiData.media?.image_url_thumbnail || "",
            imageUrlMid: apiData.image_url_medium || apiData.media?.image_url_medium || "",
            meal_id: mealId,
            meal_tags: apiData.meal_tags || {
                macro: [],
                micronutrient: [],
                functional: [],
                diet_lifestyle: []
            }
        };

        return mappedData;
    } catch (error) {
        console.error('Error in fetchMealDetails:', error);
        throw new Error('Could not fetch meal details.');
    }
};

/**
 * Fetch alternative meals for a given meal ID
 */
export const fetchAlternativeMeals = async (mealId: string) => {
    if (!mealId) {
        throw new Error('Meal ID is required');
    }

    try {
        const endpoint = `/recommendations/alt-meal/${mealId}`;
        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch alternative meals');
        }

        return result.data;
    } catch (error) {
        console.error('Error in fetchAlternativeMeals:', error);
        // Return empty array instead of throwing to prevent breaking the UI if alternatives fail
        return [];
    }
};

/**
 * Fetch detailed add-on meal information by add-on ID
 */
export const fetchAddonDetails = async (addonId: string) => {
    if (!addonId) {
        throw new Error('Add-on ID is required');
    }

    try {
        const endpoint = `/dashboard/add-ons/${addonId}`;

        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch add-on details');
        }

        // Map API response to expected interface structure
        const apiData = result.data;
        const mappedData = {
            name: apiData.name || `Add-on ${addonId}`,
            author: "Chef Saxena", // Add-ons don't have authors in the API response
            originalRecipeLink: undefined,
            description: apiData.notes || apiData.recipe || "",
            skillLevel: "Easy", // Add-ons are typically easy
            cookTime: 12, // Default for add-ons
            servings: 1, // Default for add-ons
            servingSize: "1 plate",
            estimatedCost: "₹50-60", // Default for add-ons
            calories: 225, // Will be calculated from ingredients if available
            carbs: 32,
            protein: 6,
            fats: 7,
            dailyDietPercentage: 11,
            ingredients: apiData.ingredients || [],
            cookingSteps: apiData.recipe || "",
            imageUrl: apiData.media?.image_url || apiData.media?.imageurl || "",
            imageUrlThumb: apiData.media?.image_url_thumbnail || apiData.media?.imageurl || "",
            imageUrlMid: apiData.media?.image_url_medium || apiData.media?.imageurl || ""
        };

        return mappedData;
    } catch (error) {
        console.error('Error in fetchAddonDetails:', error);
        throw new Error('Could not fetch add-on details.');
    }
};
