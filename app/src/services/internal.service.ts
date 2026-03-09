import { api } from "@/lib/httpClient";

///////////////////////////////////////////////
/////////// Internal Dashboard ////////////////
///////////////////////////////////////////////

/**
 * Fetch all households with primary member names and approval status (batched)
 */
export const getAllHouseholdsWithPrimaryNamesAndApproval = async (): Promise<any[]> => {
    try {
        const result = await api.get('/internal/internal-dashboard', {
            requireAuth: true
        });

        if (result.success && result.data) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching households for internal dashboard:', error);
        return [];
    }
};
