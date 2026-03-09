import { DocumentData } from 'firebase/firestore';
import { api } from "@/lib/httpClient";

/////////////////////////////////////
/////// Generic Functions
/////////////////////////////////////

/**
 * Generic function to add a document to any collection
 */
export const updateDocument = async <T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await api.post('internal/update-document', {
            collectionName,
            documentId,
            data,
        }, { requireAuth: true });

        if (!result.success) {
            throw new Error(result.error || 'Failed to update document via backend');
        }
        return { success: true };
    } catch (error) {
        console.error(`Error updating document via backend in ${collectionName}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

export const updateDocumentsByConstraints = async <T extends DocumentData>(
    collectionName: string,
    constraints: any = {},
    data: Partial<T>
): Promise<{ success: boolean; error?: string }> => {
    try {
        // Find documents matching constraints
        const result = await getDocuments<T>(collectionName, constraints);

        if (!result.success || !result.data) {
            return { success: false, error: 'Failed to find documents' };
        }

        // Update each matching document
        for (const doc of result.data) {
            // @ts-ignore - usually documents from getDocuments have an id
            const docId = doc.id;
            if (docId) {
                await updateDocument<T>(collectionName, docId, data);
            }
        }

        return { success: true };
    } catch (error) {
        console.error(`Error updating documents in ${collectionName}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Function to get documents via backend API
 */
export const getDocuments = async <T>(
    collectionName: string,
    constraints: any = {} // You may want to define a type for constraints
): Promise<{ success: boolean; data?: T[]; error?: string }> => {
    try {
        const result = await api.post<T[]>('internal/get-documents', {
            collectionName,
            constraints,
        }, { requireAuth: true });

        if (!result.success) {
            throw new Error(result.error || 'Failed to get documents via backend');
        }
        return { success: true, data: result.data };
    } catch (error) {
        console.error(`Error getting documents via backend from ${collectionName}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};
