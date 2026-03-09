import ingredientsData from './mock_ing.json';
import { GroceryItem } from '../../groceries/model/groceries.types';

// Type for the ingredients.json structure
interface Ingredient {
    id: string;
    ing_id?: string;
    name: string;
    media?: {
        image_url?: string;
        image_updated_at?: string;
    };
    aliases?: string[];
    category?: string;
    subcategory?: string;
    perishable?: boolean;
    processed?: boolean;
}

const ingredientsMap = new Map<string, Ingredient>();

// Index ingredients for O(1) lookup
(ingredientsData as Ingredient[]).forEach(item => {
    // Index by Primary ID
    if (item.id) ingredientsMap.set(item.id, item);
    // Index by ing_id if different
    if (item.ing_id && item.ing_id !== item.id) ingredientsMap.set(item.ing_id, item);
});

export const hydrateStaples = (staples: GroceryItem[]): GroceryItem[] => {
    return staples.map(staple => {
        const ingredientId = staple.details.ing_id;
        const matchingIngredient = ingredientsMap.get(ingredientId);

        if (matchingIngredient && matchingIngredient.media?.image_url) {
            return {
                ...staple,
                image_url: matchingIngredient.media.image_url
            };
        }

        // Fallback or keep existing if no match found (though we expect matches)
        return staple;
    });
};
