import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////// User Profile
/////////////////////////////////////

/**
 * Update user profile using the new API endpoint
 */
export const updateUserProfile = async (
    userId: string,
    userData: Partial<{
        name: string;
        email: string;
        age: number;
        height: number;
        weight: number;
        gender: string;
        goals: string[];
        allergies: string[];
        majorDislikes: string[];
        activityLevel: string;
        workoutFrequency: string;
        dietaryPreferences: string[];
        medicalConditions: string[];
        whatsappNumber: string;
        mealSchedule: any;
    }>,
    healthReportFile?: File
): Promise<{ success: boolean; error?: string; data?: any }> => {
    try {
        // Map camelCase to snake_case for backend
        const payload: any = { ...userData };

        if (userData.whatsappNumber !== undefined) {
            payload.whatsapp_number = userData.whatsappNumber;
            delete payload.whatsappNumber;
        }
        if (userData.majorDislikes !== undefined) {
            payload.major_dislikes = userData.majorDislikes;
            delete payload.majorDislikes;
        }


        if (userData.workoutFrequency !== undefined) {
            payload.workout_frequency = userData.workoutFrequency;
            delete payload.workoutFrequency;
        }
        if (userData.dietaryPreferences !== undefined) {
            payload.dietary_preferences = userData.dietaryPreferences;
            delete payload.dietaryPreferences;
        }
        if (userData.medicalConditions !== undefined) {
            payload.medical_conditions = userData.medicalConditions;
            delete payload.medicalConditions;
        }
        if (userData.activityLevel !== undefined) {
            payload.activity_level = userData.activityLevel;
            delete payload.activityLevel;
        }
        if (userData.mealSchedule !== undefined) {
            payload.meal_schedule = userData.mealSchedule;
            delete payload.mealSchedule;
        }

        // If there's a health report file, use FormData (multipart)
        if (healthReportFile) {
            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));
            formData.append('healthReport', healthReportFile);

            const result = await api.put(`/household/profile/update-user/${userId}`, formData, {
                requireAuth: true
            });

            if (!result.success) {
                throw new Error(result.error || 'Failed to update user profile via backend');
            }
            return { success: true, data: result.data };
        }

        // No file — send JSON as before
        const result = await api.put(`/household/profile/update-user/${userId}`, payload, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update user profile via backend');
        }
        return { success: true, data: result.data };
    } catch (error) {
        console.error(`Error updating user profile via backend for user ${userId}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};
