import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////// Inventory
/////////////////////////////////////

/**
 * Fetch inventory list from dashboard API endpoint
 */
export async function fetchHouseholdInventoryList(householdId: string) {
    if (!householdId) {
        throw new Error('Household ID is required');
    }

    try {
        const endpoint = `/household/inventory/${householdId}`;
        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch household inventory list');
        }

        return result.data;
    } catch (error) {
        console.error('Error in fetchHouseholdInventoryList:', error);
        throw new Error('Could not fetch household inventory list.');
    }
}

/**
 * Update household inventory list
 */
export const updateHouseholdInventory = async (
    householdId: string,
    inventoryList: any[]
) => {
    try {
        const endpoint = `/household/inventory/${householdId}`;
        const result = await api.post(endpoint, {
            inventory: inventoryList
        }, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update household inventory');
        }

        return result.data;
    } catch (error) {
        console.error('Error in updateHouseholdInventory:', error);
        throw new Error('Could not update household inventory.');
    }
};
