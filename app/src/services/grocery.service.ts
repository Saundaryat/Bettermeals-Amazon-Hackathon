import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////// Grocery List, Archive
/////////////////////////////////////


/**
 * Get all grocery lists for a household (for history)
 */
// export const getGroceryListHistory = async (householdId: string, limitCount: number = 10): Promise<GroceryList[]> => {
//   try {
//     const result = await getDocuments<GroceryList>('groceryLists', [
//       where('householdId', '==', householdId),
//       orderBy('createdAt', 'desc'),
//       limit(limitCount)
//     ]);

//     return result.success && result.data ? result.data : [];
//   } catch (error) {
//     console.error('Error fetching grocery list history:', error);
//     return [];
//   }
// };

/**
 * Toggle grocery item checked status
 */
// export const toggleGroceryItem = async (
//   groceryListId: string, 
//   itemId: string, 
//   isChecked: boolean
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     const groceryList = await getDocument<GroceryList>('groceryLists', groceryListId);

//     if (!groceryList.success || !groceryList.data) {
//       return { success: false, error: 'Grocery list not found' };
//     }

//     const updatedItems = groceryList.data.items.map(item => 
//       item.id === itemId ? { ...item, isChecked } : item
//     );

//     return updateDocument<GroceryList>('groceryLists', groceryListId, { items: updatedItems });
//   } catch (error) {
//     console.error('Error toggling grocery item:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error occurred',
//     };
//   }
// };

/**
 * Add item to grocery list
 */
// export const addGroceryItem = async (
//   groceryListId: string, 
//   item: Omit<GroceryItem, 'id'>
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     const groceryList = await getDocument<GroceryList>('groceryLists', groceryListId);

//     if (!groceryList.success || !groceryList.data) {
//       return { success: false, error: 'Grocery list not found' };
//     }

//     const newItem: GroceryItem = {
//       ...item,
//       id: crypto.randomUUID(),
//       isChecked: false,
//     };

//     const updatedItems = [...groceryList.data.items, newItem];

//     return updateDocument<GroceryList>('groceryLists', groceryListId, { items: updatedItems });
//   } catch (error) {
//     console.error('Error adding grocery item:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error occurred',
//     };
//   }
// };

/**
 * Remove item from grocery list
 */
// export const removeGroceryItem = async (
//   groceryListId: string, 
//   itemId: string
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     const groceryList = await getDocument<GroceryList>('groceryLists', groceryListId);

//     if (!groceryList.success || !groceryList.data) {
//       return { success: false, error: 'Grocery list not found' };
//     }

//     const updatedItems = groceryList.data.items.filter(item => item.id !== itemId);

//     return updateDocument<GroceryList>('groceryLists', groceryListId, { items: updatedItems });
//   } catch (error) {
//     console.error('Error removing grocery item:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error occurred',
//     };
//   }
// }; 

/**
 * Fetch grocery list from dashboard API endpoint
 */
/**
 * Fetch grocery list from dashboard API endpoint
 */
export async function fetchDashboardGroceryList(householdId: string, forNextWeek: boolean = false) {
    if (!householdId) {
        throw new Error('Household ID is required');
    }

    try {
        const endpoint = `/household/grocery-plan/${householdId}?for_next_week=${forNextWeek}`;

        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch dashboard grocery list');
        }

        return result.data;
    } catch (error) {
        console.error('Error in fetchDashboardGroceryList:', error);
        throw new Error('Could not fetch dashboard grocery list.');
    }
}

/**
 * Generate a new weekly grocery plan for a household
 * @param splitMode - "full_week" | "mid_week" | "per_day"
 */
export const generateWeeklyGroceryPlan = async (
    householdId: string,
    forNextWeek: boolean = false,
    splitMode: 'full_week' | 'mid_week' | 'per_day' = 'per_day'
) => {
    try {
        const endpoint = `/household/generate-weekly-grocery-plan/${householdId}?split_mode=${splitMode}&for_next_week=${forNextWeek}`;

        const result = await api.post(endpoint, {}, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to generate weekly grocery plan');
        }

        return result.data;
    } catch (error) {
        console.error('Error in generateWeeklyGroceryPlan:', error);
        throw new Error('Could not generate weekly grocery plan.');
    }
};

/**
 * Mark groceries as ordered via backend API
 */
export const markGroceriesAsOrdered = async (
    householdId: string,
    groceryItems: any[]
) => {
    try {
        const endpoint = `/household/update-from-grocery/${householdId}`;
        const result = await api.post(endpoint, {
            grocery_list: groceryItems
        }, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to mark groceries as ordered');
        }

        return result.data;
    } catch (error) {
        console.error('Error in markGroceriesAsOrdered:', error);
        throw new Error('Could not mark groceries as ordered.');
    }
};
