import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////// Household Dashboard Info
/////////////////////////////////////

export const getHouseholdDashboardInfo = async (householdId: string) => {
    try {
        const result = await api.get(`/household/profile-dashboard/${householdId}`, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch household dashboard info');
        }

        // The API response data is in result.data, not directly in result
        const apiData = result.data as any;

        // Transform the API response to match frontend TypeScript interfaces
        const transformedResult = {
            success: result.success,
            household: apiData?.household ? {
                id: apiData.household.id,
                numberOfUsers: apiData.household.number_of_users,
                address: apiData.household.address,
                isCookAvailable: apiData.household.is_cook_available,
                paymentDone: apiData.household.payment_done,
                userIds: apiData.household.user_ids,
                householdId: apiData.household.household_id,
                createdAt: apiData.household.created_at,
                kitchenEquipments: apiData.household.kitchen_equipments || [],
                updatedAt: apiData.household.updated_at,
                primaryUserId: apiData.household.primary_user_id,
                cookContact: apiData.household.cook_phone_number,
                username: apiData.household.username,
                email: apiData.household.email,
                phoneNumber: apiData.household.phone_number,
                whatsappNumber: apiData.household.whatsapp_number,
                authEmail: apiData.household.auth_email,
                authPhoneNumber: apiData.household.auth_phone_number,
                dietPreference: apiData.household.diet_preference,
                selectedFeatures: apiData.household.selectedFeatures || apiData.household.selected_features,
                isOnboarded: apiData.household.is_onboarded,
                type: apiData.household.type
            } : null,
            primaryUser: apiData?.primaryUser,
            users: apiData?.users ? apiData.users.map((user: any) => ({
                id: user.user_id,
                userId: user.user_id,
                name: user.name || '',
                email: user.email || '',
                whatsappNumber: user.whatsapp_number || user.whatsappNumber || '',
                age: user.age || 0,
                height: user.height || 0,
                weight: user.weight || 0,
                gender: user.gender || user.sex || '',
                goals: user.goals || [],
                allergies: user.allergies || [],
                majorDislikes: user.major_dislikes || [],
                activityLevel: user.activity_level || user.active || '',
                mealSchedule: user.meal_schedule || {},
                createdAt: user.created_at,
                updatedAt: user.updated_at,
                householdId: user.household_id,
                medicalConditions: user.medical_conditions || [],
                workoutFrequency: user.workout_frequency || '',
                dietaryPreferences: user.dietary_preferences || [],
                healthReportUrl: user.health_report_url || '',
                healthReportSummary: user.health_report_summary || user.healthReportSummary || null
            })) : []
        };

        return transformedResult;
    } catch (error) {
        console.error('Error in getHouseholdDashboardInfo:', error);
        return {
            success: false,
            household: null,
            primaryUser: null,
            users: [],
            error: error instanceof Error ? error.message : String(error),
        };
    }
};

/////////////////////////////////////
/////// Household Actions & Status
/////////////////////////////////////

/**
 * Register a specific action for the household
 */
export const registerHouseholdAction = async (
    householdId: string,
    actionType: string,
    metadata: any = {}
): Promise<{ success: boolean; error?: string }> => {
    try {
        const endpoint = `/household/action/${householdId}`;
        const result = await api.post(endpoint, {
            action_type: actionType,
            metadata: metadata,
        }, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to register household action');
        }

        return { success: true };
    } catch (error) {
        console.error(`Error registering action ${actionType} for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Update the high-level status of the household
 */
export const updateHouseholdStatus = async (
    householdId: string,
    status: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const endpoint = `/household/status/${householdId}`;
        const result = await api.post(endpoint, {
            status: status,
        }, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update household status');
        }

        return { success: true };
    } catch (error) {
        console.error(`Error updating status ${status} for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Get the high-level status of the household (or specific key)
 */
export const getHouseholdStatus = async (
    householdId: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        const endpoint = `/household/status/${householdId}`;
        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to get household status');
        }

        return { success: true, data: result };
    } catch (error) {
        console.error(`Error getting status for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Update household information using the new API endpoint
 */
export const updateHousehold = async (
    householdId: string,
    householdData: Partial<{
        address: string;
        numberOfUsers: number;
        isCookAvailable: boolean;
        whatsappNumber: string;
        kitchenEquipments: string[];
        cookContact: string;
    }>
): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await api.put(`/household/update/${householdId}`, householdData, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update household via backend');
        }
        return { success: true };
    } catch (error) {
        console.error(`Error updating household via backend for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Fetch pending actions for a household
 */
export async function fetchPendingActions(householdId: string) {
    if (!householdId) {
        throw new Error('Household ID is required');
    }

    try {
        const endpoint = `/household/${householdId}/pending-actions`;
        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch pending actions');
        }

        return result.data;
    } catch (error) {
        console.error('Error in fetchPendingActions:', error);
        throw new Error('Could not fetch pending actions.');
    }
}

/**
 * Update specific workflow status node
 */
export const updateWorkflowStatus = async (
    householdId: string,
    field: string,
    status: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const endpoint = `/household/${householdId}/workflow`;
        const result = await api.post(endpoint, {
            field,
            status
        }, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update workflow status');
        }

        return { success: true };
    } catch (error) {
        console.error(`Error updating workflow status ${field}=${status} for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Get the latest V2 workflow status for a specific week.
 */
export const getWorkflowStatusV2 = async (
    householdId: string,
    week?: string
): Promise<{ success: boolean; data?: any; error?: string; status?: number }> => {
    try {
        const endpoint = `/household/${householdId}/workflow-status${week ? `?week=${week}` : ''}`;
        // Use api.get which typically handles the non-200 logic, but we need to check if 404 is thrown or returned
        // Assuming api wrapper returns result object
        const result = await api.get(endpoint, {
            requireAuth: true
        });

        if (!result.success) {
            // Pass through the result (containing error and potentially status)
            return result;
        }

        return { success: true, data: result.data };
    } catch (error) {
        console.error(`Error getting V2 workflow status for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Log a V2 workflow status update (Audit Log).
 */
export const logWorkflowStatusV2 = async (
    statusData: any, // Typed as any here, but matches WorkflowStatusV2 structure
    householdId: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const endpoint = `/household/${householdId}/workflow-status`;
        const result = await api.post(endpoint, statusData, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to log workflow status');
        }

        return { success: true };
    } catch (error) {
        console.error(`Error logging V2 workflow status for household ${householdId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};
