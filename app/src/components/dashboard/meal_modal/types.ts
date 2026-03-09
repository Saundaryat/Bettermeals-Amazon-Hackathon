
export interface MealDetails {
    meal_id?: string;
    name: string;
    author?: string;
    originalRecipeLink?: string;
    description?: string;
    skillLevel?: string;
    cookTime?: number;
    servings?: number;
    servingSize?: string;
    estimatedCost?: string;
    calories?: number;
    carbs?: number;
    protein?: number;
    fats?: number;
    dailyDietPercentage?: number;
    ingredients?: Array<{
        name: string;
        amount: string;
        media?: {
            image_url?: string;
            image_url_thumbnail?: string;
        };
    }>;
    cookingSteps?: string;
    imageUrl?: string;
    imageUrlMid?: string;
    imageUrlThumb?: string;
    meal_tags?: {
        macro: string[];
        micronutrient: string[];
        functional: string[];
        diet_lifestyle: string[];
    };
}

export interface MealDetailModalProps {
    isOpen: boolean;
    mealId: string;
    onClose: () => void;
    initialImageUrl?: string;
    onReplaceMeal?: (newMeal: MealDetails) => void;
    mealPlanData?: any;
    addonsData?: any;
    imagesPreloaded?: boolean;
}
