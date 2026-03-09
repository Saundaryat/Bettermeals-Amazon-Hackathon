import { api } from "@/lib/httpClient";

export interface FeedbackData {
    feedback: string;
    household_id: string;
    image?: File | null;
}

/**
 * Submit feedback to the backend
 */
export const submitFeedback = async (data: FeedbackData) => {
    try {
        const formData = new FormData();
        formData.append('text', data.feedback);
        formData.append('household_id', data.household_id);

        if (data.image) {
            formData.append('image', data.image);
        }

        // Log what we are sending
        console.log('Submitting feedback to /feedback:', {
            text: data.feedback,
            household_id: data.household_id,
            image: data.image ? data.image.name : 'no-image'
        });

        // Debug FormData entries
        for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        const result = await api.post('/feedback', formData, {
            requireAuth: true
        });

        if (!result.success) {
            throw new Error(result.error || 'Failed to submit feedback');
        }

        return result.data;
    } catch (error) {
        console.error('Error in submitFeedback:', error);
        throw error;
    }
};
