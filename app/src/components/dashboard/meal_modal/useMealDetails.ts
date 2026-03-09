import { useQuery } from "@tanstack/react-query";
import { fetchMealDetails, fetchAddonDetails } from "@/services/database";
import { MealDetails } from "./types";
// import { MOCK_MEAL_DETAILS } from "@/mock_data/meal_details_mock";
// import { ENABLE_MOCK_DATA_FALLBACK } from "@/config";

export function useMealDetails(mealId: string, isOpen: boolean) {
    const { data: mealDetails, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['meal-details', mealId],
        queryFn: async () => {
            console.log('useMealDetails: Fetching meal data for mealId:', mealId);

            try {
                // Robust check for add-on types
                const isAddon =
                    mealId.startsWith('desc_') ||
                    mealId.includes('addon') ||
                    mealId.includes('_bowl') ||
                    mealId.includes('_salad');

                let data;
                if (isAddon) {
                    console.log('useMealDetails: Detected add-on meal, calling fetchAddonDetails');
                    data = await fetchAddonDetails(mealId);
                } else {
                    console.log('useMealDetails: Detected regular meal, calling fetchMealDetails');
                    data = await fetchMealDetails(mealId);
                }

                console.log('useMealDetails: Received data:', data);
                return data;
            } catch (err) {
                console.error('useMealDetails: Error fetching meal details:', err);

                // Use mock data if fallback is enabled in config
                // if (ENABLE_MOCK_DATA_FALLBACK) {
                //     console.warn("Using mock data due to fetch error (ENABLE_MOCK_DATA_FALLBACK is true)");
                //     return MOCK_MEAL_DETAILS;
                // }

                throw err;
            }
        },
        enabled: isOpen && !!mealId,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: false, // Don't retry if it fails (especially since we have fallback logic)
    });

    return {
        mealDetails: mealDetails || null,
        loading,
        error: error ? (error instanceof Error ? error.message : 'Failed to fetch meal details') : null,
        refetch
    };
}
