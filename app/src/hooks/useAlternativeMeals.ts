import { useQuery } from "@tanstack/react-query";
import { fetchAlternativeMeals } from "../services/database";
import { MealDetails } from "../components/dashboard/meal_modal/types";

export const QUERY_KEYS = {
    alternativeMeals: (mealId: string) => ["alternativeMeals", mealId],
};

export function useAlternativeMeals(mealId: string | undefined) {
    return useQuery<MealDetails[]>({
        queryKey: QUERY_KEYS.alternativeMeals(mealId || ""),
        queryFn: () => fetchAlternativeMeals(mealId!),
        enabled: !!mealId,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
}
