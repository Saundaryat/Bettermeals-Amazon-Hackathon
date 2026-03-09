import { useState, useEffect } from 'react';
import { preloadMealPlanImages } from '@/utils/imagePreloader';

export function useImagePreloading(
    hasRealMealPlan: boolean,
    realMealPlanData: any,
    realAddonsData: any
) {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);
    const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });

    // Create a signature to detect if the meal plan data has actually changed
    const dataSignature = hasRealMealPlan && realMealPlanData
        ? Object.keys(realMealPlanData).map(day =>
            realMealPlanData[day]?.length || 0
        ).join('-') + '-' + (realMealPlanData[Object.keys(realMealPlanData)[0]]?.[0]?.meal_id || '')
        : '';

    useEffect(() => {
        if (hasRealMealPlan && realMealPlanData) {
            setImagesPreloaded(false);
            setPreloadProgress({ loaded: 0, total: 0 });

            preloadMealPlanImages(
                realMealPlanData,
                realAddonsData || {},
                (loaded, total) => {
                    setPreloadProgress({ loaded, total });
                }
            ).then(() => {
                setImagesPreloaded(true);
            }).catch((error) => {
                console.error('[Planner] Error preloading images:', error);
                setImagesPreloaded(true);
            });
        }
    }, [dataSignature, hasRealMealPlan, realMealPlanData, realAddonsData]);

    return { imagesPreloaded, preloadProgress };
}
