import { useState, useMemo } from 'react';
import { GroceryItem } from '@/components/dashboard/groceries/model/groceries.types';
import { CATEGORY_PRIORITY } from '@/components/dashboard/groceries/utils/GrocerySorter';

export interface CategoryFilter {
    name: string;
    label: string;
    count: number;
}

export function usePantryFiltering(staples: GroceryItem[], perishables: GroceryItem[]) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Combine all items
    const allItems = useMemo(() => [...staples, ...perishables], [staples, perishables]);

    // Group items by category
    const itemsByCategory = useMemo(() => {
        const categoryMap = new Map<string, GroceryItem[]>();

        allItems.forEach(item => {
            let categoryName = item.category || 'Other';
            // Normalize casing to Title Case for consistency with Groceries
            if (categoryName && categoryName !== 'Other') {
                categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
            }

            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, []);
            }
            categoryMap.get(categoryName)?.push(item);
        });

        return categoryMap;
    }, [allItems]);

    // Create category list for pills
    const categories: CategoryFilter[] = useMemo(() => {
        const categoryList = Array.from(itemsByCategory.entries()).map(([name, items]) => ({
            name: name.toLowerCase(),
            label: name,
            count: items.length
        }));

        // Sort categories based on priority, similar to Groceries
        categoryList.sort((a, b) => {
            // Note: CATEGORY_PRIORITY values are typically Title Case, while a.label/b.label come from our map keys (also Title Case normalized above)
            // But we should be careful about matching. The map keys were normalized, so they should match the Priority list format (Title Case).

            const indexA = CATEGORY_PRIORITY.indexOf(a.label);
            const indexB = CATEGORY_PRIORITY.indexOf(b.label);

            // If both are in the priority list, sort by index
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            // If only a is in the list, it comes first
            if (indexA !== -1) return -1;
            // If only b is in the list, it comes first
            if (indexB !== -1) return 1;

            // Otherwise sort alphabetically
            return a.label.localeCompare(b.label);
        });

        return [
            { name: 'all', label: 'All', count: allItems.length },
            ...categoryList
        ];
    }, [itemsByCategory, allItems.length]);

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        let itemsToReturn = [];
        if (selectedCategory === 'all') {
            itemsToReturn = [...allItems];

            // Sort items by category priority so similar items are grouped together
            itemsToReturn.sort((a, b) => {
                let catA = a.category || 'Other';
                let catB = b.category || 'Other';

                // Normalize for comparison
                catA = catA.charAt(0).toUpperCase() + catA.slice(1).toLowerCase();
                catB = catB.charAt(0).toUpperCase() + catB.slice(1).toLowerCase();

                // If same category, sort by name
                if (catA === catB) {
                    return a.name.localeCompare(b.name);
                }

                const indexA = CATEGORY_PRIORITY.indexOf(catA);
                const indexB = CATEGORY_PRIORITY.indexOf(catB);

                // If both in priority list
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only A
                if (indexA !== -1) return -1;
                // If only B
                if (indexB !== -1) return 1;

                return catA.localeCompare(catB);
            });
            return itemsToReturn;
        }

        // Find the category name (case-insensitive match)
        const categoryEntry = Array.from(itemsByCategory.entries()).find(
            ([name]) => name.toLowerCase() === selectedCategory
        );
        return categoryEntry ? categoryEntry[1] : [];
    }, [selectedCategory, itemsByCategory, allItems]);

    // Group filtered items back into staples and perishables for display
    const filteredStaples = useMemo(() =>
        // filteredItems.filter(item => item.isStaple && !item.perishable),
        filteredItems.filter(item => !item.perishable),
        [filteredItems]
    );

    const filteredPerishables = useMemo(() =>
        filteredItems.filter(item => item.perishable),
        [filteredItems]
    );

    return {
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredStaples,
        filteredPerishables
    };
}
