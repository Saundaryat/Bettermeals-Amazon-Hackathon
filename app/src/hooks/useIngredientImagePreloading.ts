import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchMealDetails, fetchAddonDetails } from '@/services/database';
import { MealDetails } from '@/components/dashboard/meal_modal/types';
import {
    extractIngredientImageUrls,
    preloadIngredientImagesFromMealDetails
} from '@/utils/imagePreloader';

interface UseIngredientImagePreloadingProps {
    mealId: string | null;
    isOpen: boolean;
    mealPlanData?: any;
    addonsData?: any;
    imagesPreloaded?: boolean;
}

/**
 * Hook to lazily preload ingredient images when meal modal opens
 * - Preloads ingredient images for the currently opened meal
 * - In background, preloads ingredient images for other meals in the plan
 */
export function useIngredientImagePreloading({
    mealId,
    isOpen,
    mealPlanData,
    addonsData,
    imagesPreloaded = true // Default to true to allow behavior if prop not provided
}: UseIngredientImagePreloadingProps) {
    const queryClient = useQueryClient();
    const preloadingRef = useRef<Set<string>>(new Set()); // Track meals we're currently preloading

    useEffect(() => {
        if (!isOpen || !mealId) {
            return;
        }

        // Prevent duplicate preloading
        if (preloadingRef.current.has(mealId)) {
            return;
        }

        const preloadCurrentMealIngredients = async () => {
            try {
                // Check if meal details are already in React Query cache
                const queryKey = ['meal-details', mealId];
                const cachedData = queryClient.getQueryData<MealDetails>(queryKey);

                let mealDetails: MealDetails | null = cachedData || null;

                // If not cached, fetch it
                if (!mealDetails) {
                    const isAddon =
                        mealId.startsWith('desc_') ||
                        mealId.includes('addon') ||
                        mealId.includes('_bowl') ||
                        mealId.includes('_salad');

                    if (isAddon) {
                        mealDetails = await fetchAddonDetails(mealId);
                    } else {
                        mealDetails = await fetchMealDetails(mealId);
                    }
                }

                // Preload ingredient images for current meal
                if (mealDetails) {
                    await preloadIngredientImagesFromMealDetails(mealDetails);
                    console.log(`[IngredientPreloader] Preloaded ingredient images for current meal: ${mealId}`);
                }
            } catch (error) {
                console.error(`[IngredientPreloader] Error preloading ingredients for meal ${mealId}:`, error);
            }
        };

        // Preload current meal's ingredients immediately
        preloadCurrentMealIngredients();

    }, [mealId, isOpen, queryClient]); // Removed mealPlanData, addonsData, imagesPreloaded from dependencies as they are no longer used
}

