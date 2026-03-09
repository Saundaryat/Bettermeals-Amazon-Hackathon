import { UIMeal } from '@/components/mealPlan/MealDisplay';
import { Meal, Addon } from '@/services/types';
import { getProxiedImageUrl, PLACEHOLDER_IMAGE_URL } from '@/utils/imageUrl';

export interface UIDayPlan {
    breakfast: UIMeal[];
    lunch: UIMeal[];
    dinner: UIMeal[];
}

export type UIWeeklyPlan = Record<string, UIDayPlan>;

export const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

export const DAYS_OF_WEEK_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export const DAYS_OF_WEEK_DISPLAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const emptyDayMeals: UIDayPlan = {
    breakfast: [],
    lunch: [],
    dinner: []
};

/**
 * Check if a day's meal plan is empty (no breakfast, lunch, or dinner)
 */
export const isDayEmpty = (dayMeals: UIDayPlan | null | undefined): boolean => {
    return !dayMeals ||
        (dayMeals.breakfast.length === 0 &&
            dayMeals.lunch.length === 0 &&
            dayMeals.dinner.length === 0);
};

export const transformRealMealPlanToUIFormat = (
    realMeals: Record<string, Record<string, Meal[]>>,
    realAddons?: Record<string, Record<string, Record<string, Addon>>>,
    userMap?: Record<string, string>
): UIWeeklyPlan | null => {
    if (!realMeals) {
        return null;
    }

    const transformed: UIWeeklyPlan = {};

    // Group meals by day and meal type
    Object.keys(realMeals).forEach(day => {
        const daySlots = realMeals[day];

        if (daySlots) {
            transformed[day] = {
                breakfast: [],
                lunch: [],
                dinner: []
            };

            // Iterate through defined meal slots (breakfast, lunch, dinner)
            mealTypes.forEach((slotName) => {
                const mealsInSlot = daySlots[slotName];

                if (Array.isArray(mealsInSlot)) {
                    mealsInSlot.forEach((meal: Meal) => {
                        if (!meal) return;

                        const transformedMeal: UIMeal = {
                            name: meal.name || 'Unknown Meal',
                            meal_id: meal.meal_id,
                            image: getProxiedImageUrl(meal.media?.image_url) || PLACEHOLDER_IMAGE_URL,
                            image_medium: getProxiedImageUrl(meal.media?.image_url_medium),
                            image_thumbnail: getProxiedImageUrl(meal.media?.image_url_thumbnail),
                            tags: [
                                ...((meal.meal_tags as any)?.matched_tags?.goals || []),
                                ...((meal.meal_tags as any)?.matched_tags?.tags || []),
                                // ...(meal.meal_tags?.functional || []),
                                // ...(meal.meal_tags?.macro || []),
                                // ...(meal.meal_tags?.micronutrient || []),
                                // ...(meal.meal_tags?.diet_lifestyle || [])
                            ].slice(0, 5),
                            dish_type: meal.dish_type
                        };

                        transformed[day][slotName].push(transformedMeal);
                    });
                }
            });

            // Addon Support: If 'addons' field exists, treat them as ADDON dish types.
            // New Structure: UUID -> Day -> MealType -> Addon Object
            if (realAddons) {
                // Iterate over each user/household member (UUID keys)
                Object.entries(realAddons).forEach(([userId, userPlan]) => {
                    // userPlan is Record<Day, Record<MealType, Addon>>
                    if (!userPlan || !userPlan[day]) return;

                    const dayAddonSlots = userPlan[day];

                    mealTypes.forEach((mealType) => {
                        const addon = dayAddonSlots[mealType];

                        if (addon) {
                            // Track existing meal_ids to prevent duplicates
                            const existingMealIds = new Set(
                                transformed[day][mealType].map(m => m.meal_id)
                            );

                            const addonId = addon.addon_id || addon.id;

                            // Skip if this addon already exists (prevent duplicates)
                            if (existingMealIds.has(addonId)) {
                                return;
                            }

                            const addonTags = addon.addon_tags || addon.meal_tags;
                            const userName = userMap?.[userId];

                            const transformedAddon: UIMeal = {
                                name: addon.name || 'Unknown Addon',
                                meal_id: addonId,
                                image: getProxiedImageUrl(addon.media?.image_url || (addon as any).image_url || (addon as any).image) || PLACEHOLDER_IMAGE_URL,
                                image_medium: getProxiedImageUrl(addon.media?.image_url_medium || addon.media?.image_url), // Fallback to main image if medium missing
                                image_thumbnail: getProxiedImageUrl(addon.media?.image_url_thumbnail || addon.media?.image_url || (addon as any).image_url || (addon as any).image), // Fallback to main image if thumbnail missing
                                tags: [
                                    ...((addonTags as any)?.matched_tags?.goals || []),
                                    ...((addonTags as any)?.matched_tags?.tags || []),
                                    // ...(addonTags?.functional || []),
                                    // ...(addonTags?.macro || []),
                                    // ...(addonTags?.micronutrient || []),
                                    // ...(addonTags?.diet_lifestyle || [])
                                ].slice(0, 5),
                                dish_type: 'ADDON',
                                user_name: userName
                            };

                            transformed[day][mealType].push(transformedAddon);
                        }
                    });
                });
            }
        }
    });

    return transformed;
};
