import { GroceryCategory, GroceryItem, GroceryListSection } from '../model/groceries.types';
import { sortCategories, sortItems } from '../utils/GrocerySorter';

import pantryData from '../../inventory/pantry/pantry_data/pantry.json';

// Index pantry data for hydration
const pantryLookup = new Map<string, string>(); // ing_id -> image_url
const pantryNameLookup = new Map<string, string>(); // name -> image_url

Object.values(pantryData).forEach((item: any) => {
    const imageUrl = item.media?.image_url;
    if (imageUrl) {
        if (item.id) pantryLookup.set(item.id, imageUrl);
        if (Array.isArray(item.ing_id)) {
            item.ing_id.forEach((id: string) => pantryLookup.set(id, imageUrl));
        }
        if (item.name) pantryNameLookup.set(item.name.toLowerCase().trim(), imageUrl);
    }
});

// Function to transform API data structure to component format
export function transformApiDataToCategories(apiData: GroceryListSection | GroceryItem[] | any): GroceryCategory[] {

    // The API structure is: grocery_plan.weekly_grocery_plan.grocery_list
    let groceryItems: GroceryItem[] = [];

    if (apiData?.grocery_list && Array.isArray(apiData.grocery_list)) {
        groceryItems = apiData.grocery_list;
    } else if (Array.isArray(apiData)) {
        groceryItems = apiData;
    } else {
        console.log('No valid grocery list found in API response');
        return [];
    }


    // Group items by category
    const categoryMap = new Map<string, GroceryItem[]>();

    groceryItems.forEach((item: any) => {
        let categoryName = item.category || 'Other';
        const quantity = item.order_specs?.ordered_qty || item.order_specs?.required_qty || 1;
        const unit = item.order_specs?.unit || 'piece';

        // Normalize category names
        const lowerCategory = categoryName.toLowerCase();
        if (['eggs', 'protein', 'meat', 'seafood'].includes(lowerCategory)) {
            categoryName = 'Protein & Meat';
        } else if (['nuts', 'seeds'].includes(lowerCategory)) {
            categoryName = 'Nuts & Seeds';
        } else {
            // Capitalize first letter for other categories
            categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        }

        if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, []);
        }

        const itemId = item.prd_id || `item-${Math.random()}`;
        const ingId = item.details?.ing_id;
        const itemName = item.name?.toLowerCase().trim();

        // Hydrate image if missing
        let image_url = item.media?.image_url || item.image_url || '';
        if (!image_url) {
            if (ingId && pantryLookup.has(ingId)) {
                image_url = pantryLookup.get(ingId) || '';
            } else if (item.prd_id && pantryLookup.has(item.prd_id)) {
                image_url = pantryLookup.get(item.prd_id) || '';
            } else if (itemName && pantryNameLookup.has(itemName)) {
                image_url = pantryNameLookup.get(itemName) || '';
            }
        }

        categoryMap.get(categoryName)?.push({
            id: itemId,
            name: item.name || 'Unknown Item',
            quantity: `${quantity} ${unit}`,
            checked: true, // Will be overridden by state in UI
            optional: item.optional || false,
            perishable: item.perishable || false,
            isStaple: item.is_staple || false,
            subcategory: item.details?.subcategory || '',
            category: categoryName,
            prd_id: item.prd_id || itemId,
            image_url: image_url,
            order_specs: item.order_specs || {
                num_packs: null,
                unit: unit,
                required_qty: quantity,
                min_order_specs: { unit: unit, qty: 0 },
                ordered_qty: quantity,
                surplus: 0
            },
            details: item.details || { subcategory: '', ing_id: '' }
        });
    });

    // Convert map to array format and sort items
    const categories = Array.from(categoryMap.entries()).map(([categoryName, items]) => ({
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        items: sortItems(items)
    }));

    // Sort categories based on priority
    const sortedCategories = sortCategories(categories);

    return sortedCategories;
}
