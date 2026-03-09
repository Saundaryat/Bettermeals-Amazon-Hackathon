import { GroceryCategory, GroceryItem } from '../model/groceries.types';

// Priority list for categories - important/perishable categories first
export const CATEGORY_PRIORITY = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Grains',
    'Bread',
    'Bakery',
    'Legumes',
    'Nuts & Seeds',
    'Protein & Meat',
    'Oils',
    'Condiments',
    'Spices',
    'Sweeteners',
    'Beverages',
    'Liquids',
    'Snacks',
    'Other'
];

/**
 * Sorts grocery categories based on a predefined priority list.
 * Categories not in the list are sorted alphabetically at the end.
 */
export const sortCategories = (categories: GroceryCategory[]): GroceryCategory[] => {
    return [...categories].sort((a, b) => {
        const indexA = CATEGORY_PRIORITY.indexOf(a.name);
        const indexB = CATEGORY_PRIORITY.indexOf(b.name);

        // If both are in the priority list, sort by index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        // If only a is in the list, it comes first
        if (indexA !== -1) return -1;
        // If only b is in the list, it comes first
        if (indexB !== -1) return 1;

        // Otherwise sort alphabetically
        return a.name.localeCompare(b.name);
    });
};

/**
 * Sorts grocery items based on importance:
 * 1. Perishable items (need attention)
 * 2. Staples (essentials)
 * 3. Alphabetical by name
 */
export const sortItems = (items: GroceryItem[]): GroceryItem[] => {
    return [...items].sort((a, b) => {
        // 1. Optional items at the bottom
        if (a.optional && !b.optional) return 1;
        if (!a.optional && b.optional) return -1;

        // 2. Perishable items first (high priority)
        if (a.perishable && !b.perishable) return -1;
        if (!a.perishable && b.perishable) return 1;

        // 3. Staples next
        if (a.isStaple && !b.isStaple) return 1;
        if (!a.isStaple && b.isStaple) return -1;

        // 4. Alphabetical
        return a.name.localeCompare(b.name);
    });
};
