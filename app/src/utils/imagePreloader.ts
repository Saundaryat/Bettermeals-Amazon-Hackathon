/**
 * Image Preloader Utility
 * Preloads images to improve performance when switching between days in the meal plan
 */

import { getProxiedImageUrl, PLACEHOLDER_IMAGE_URL } from './imageUrl';

interface PreloadResult {
    url: string;
    success: boolean;
    error?: string;
}

/**
 * Preload a single image
 */
const preloadImage = (url: string): Promise<PreloadResult> => {
    return new Promise((resolve) => {
        // Use the proxy URL for preloading to avoid CORS
        const proxiedUrl = getProxiedImageUrl(url);

        if (!proxiedUrl || proxiedUrl === PLACEHOLDER_IMAGE_URL) {
            resolve({ url: proxiedUrl, success: false, error: 'Invalid or placeholder URL' });
            return;
        }

        const img = new Image();

        img.onload = () => {
            resolve({ url: proxiedUrl, success: true });
        };

        img.onerror = () => {
            resolve({ url: proxiedUrl, success: false, error: 'Failed to load image' });
        };

        // Set crossOrigin if needed for external images
        // if (proxiedUrl.startsWith('http')) {
        //     img.crossOrigin = 'anonymous';
        // }

        img.src = proxiedUrl;
    });
};

/**
 * Extract all image URLs from the meal plan data
 * PERF: Prioritize thumbnails for preloading
 */
export const extractImageUrls = (mealPlanData: any, addonsData: any): string[] => {
    const imageUrls = new Set<string>();

    if (!mealPlanData) {
        return [];
    }

    const addImage = (mediaObj: any) => {
        if (!mediaObj) return;
        // PRELOAD STRATEGY: Prefer thumbnail, then regular image
        const urlToPreload = mediaObj.image_url_thumbnail || mediaObj.image_url;
        if (urlToPreload) {
            imageUrls.add(urlToPreload);
        }
    };

    // Extract from meals
    Object.keys(mealPlanData).forEach(day => {
        const daySlots = mealPlanData[day];

        if (daySlots && typeof daySlots === 'object') {
            // Meals are organized in slots: breakfast, lunch, dinner
            Object.keys(daySlots).forEach(slot => {
                const meals = daySlots[slot];
                if (Array.isArray(meals)) {
                    meals.forEach((meal: any) => {
                        if (meal?.media) {
                            addImage(meal.media);
                        }
                    });
                }
            });
        }
    });

    // Extract from addons
    if (addonsData) {
        Object.keys(addonsData).forEach(day => {
            const dayAddons = addonsData[day];

            if (typeof dayAddons === 'object' && dayAddons !== null) {
                // Process addons using numeric indices: "0"=breakfast, "1"=lunch, "2"=dinner
                ['0', '1', '2'].forEach(indexKey => {
                    const mealTypeAddons = dayAddons[indexKey];

                    if (Array.isArray(mealTypeAddons)) {
                        mealTypeAddons.forEach((addon: any) => {
                            if (addon?.media) {
                                addImage(addon.media);
                            }
                        });
                    } else if (typeof mealTypeAddons === 'object' && mealTypeAddons !== null) {
                        Object.values(mealTypeAddons).forEach((addon: any) => {
                            if (addon?.media) {
                                addImage(addon.media);
                            }
                        });
                    }
                });
            }
        });
    }

    return Array.from(imageUrls).filter(url => url && url !== PLACEHOLDER_IMAGE_URL && url !== '/placeholder.svg');
};

/**
 * Preload multiple images with progress tracking and concurrency limit
 */
export const preloadImages = async (
    urls: string[],
    onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult[]> => {
    const total = urls.length;
    let loaded = 0;
    const MAX_CONCURRENT = 4; // Browser limit typically around 6 per domain

    console.log(`[ImagePreloader] Starting preload of ${total} images (Limit: ${MAX_CONCURRENT})`);

    const results: PreloadResult[] = [];
    const queue = [...urls];
    const activePromises: Promise<void>[] = [];

    const processNext = async (): Promise<void> => {
        if (queue.length === 0) return;

        const url = queue.shift()!;
        try {
            const result = await preloadImage(url);
            results.push(result);
        } catch (e) {
            // Should be caught in preloadImage but safe backup
            results.push({ url, success: false, error: 'Unknown error' });
        } finally {
            loaded++;
            if (onProgress) {
                onProgress(loaded, total);
            }
        }

        // Chain next item
        return processNext();
    };

    // Start initial batch
    for (let i = 0; i < Math.min(MAX_CONCURRENT, urls.length); i++) {
        activePromises.push(processNext());
    }

    await Promise.all(activePromises);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`[ImagePreloader] Preload complete: ${successful} successful, ${failed} failed`);

    return results;
};

/**
 * Preload meal plan images
 */
export const preloadMealPlanImages = async (
    mealPlanData: any,
    addonsData: any,
    onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult[]> => {
    const urls = extractImageUrls(mealPlanData, addonsData);

    if (urls.length === 0) {
        console.log('[ImagePreloader] No images to preload');
        return [];
    }

    return preloadImages(urls, onProgress);
};

/**
 * Global cache to track preloaded ingredient image URLs
 * This prevents duplicate downloads of the same ingredient image across multiple meals
 */
const preloadedIngredientImageUrls = new Set<string>();

/**
 * Extract ingredient image URLs from meal details
 */
export const extractIngredientImageUrls = (mealDetails: any): string[] => {
    const imageUrls: string[] = [];

    if (!mealDetails || !mealDetails.ingredients || !Array.isArray(mealDetails.ingredients)) {
        return imageUrls;
    }

    mealDetails.ingredients.forEach((ingredient: any) => {
        if (ingredient?.media) {
            // Prefer thumbnail, fallback to regular image
            const url = ingredient.media.image_url_thumbnail || ingredient.media.image_url;
            if (url && url !== PLACEHOLDER_IMAGE_URL && url !== '/placeholder.svg') {
                imageUrls.push(url);
            }
        }
    });

    return imageUrls;
};

/**
 * Preload ingredient images from meal details, avoiding duplicates
 */
export const preloadIngredientImagesFromMealDetails = async (
    mealDetails: any,
    onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult[]> => {
    const allUrls = extractIngredientImageUrls(mealDetails);

    // Filter out URLs that have already been preloaded
    const urlsToPreload = allUrls.filter(url => {
        if (preloadedIngredientImageUrls.has(url)) {
            return false;
        }
        preloadedIngredientImageUrls.add(url);
        return true;
    });

    if (urlsToPreload.length === 0) {
        console.log('[ImagePreloader] No new ingredient images to preload (all already cached)');
        return [];
    }

    console.log(`[ImagePreloader] Preloading ${urlsToPreload.length} ingredient images (${allUrls.length - urlsToPreload.length} already cached)`);
    return preloadImages(urlsToPreload, onProgress);
};

/**
 * Extract all meal IDs from meal plan data
 */
export const extractMealIdsFromMealPlan = (
    mealPlanData: any,
    addonsData?: any
): string[] => {
    const mealIds = new Set<string>();

    if (!mealPlanData) {
        return [];
    }

    // Extract meal IDs from meals
    Object.keys(mealPlanData).forEach(day => {
        const daySlots = mealPlanData[day];
        if (daySlots && typeof daySlots === 'object') {
            Object.keys(daySlots).forEach(slot => {
                const meals = daySlots[slot];
                if (Array.isArray(meals)) {
                    meals.forEach((meal: any) => {
                        if (meal?.meal_id) {
                            mealIds.add(meal.meal_id);
                        }
                    });
                }
            });
        }
    });

    // Extract addon IDs from addons
    if (addonsData) {
        Object.keys(addonsData).forEach(day => {
            const dayAddons = addonsData[day];
            if (dayAddons && typeof dayAddons === 'object') {
                Object.keys(dayAddons).forEach(mealTime => {
                    const mealTypeAddons = dayAddons[mealTime];
                    if (mealTypeAddons && typeof mealTypeAddons === 'object') {
                        Object.values(mealTypeAddons).forEach((addon: any) => {
                            const addonId = addon?.addon_id || addon?.id;
                            if (addonId) {
                                mealIds.add(addonId);
                            }
                        });
                    }
                });
            }
        });
    }

    return Array.from(mealIds);
};
