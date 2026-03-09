/**
 * Utility for handling image URLs and proxies
 */

// Base URL for the application, ensuring assets are loaded correctly
// relative to the app's base path (e.g. /app/)
export const PLACEHOLDER_IMAGE_URL = `${import.meta.env.BASE_URL}placeholder.svg`;

/**
 * Transforms a URL to use the local proxy if needed (for CORS)
 * @param url The original image URL
 * @returns The transformed URL
 */
/**
 * Transforms a URL to use the local proxy if needed (for CORS)
 * @param url The original image URL
 * @returns The transformed URL
 */
export const getProxiedImageUrl = (url?: string): string => {
    if (!url) return PLACEHOLDER_IMAGE_URL;

    // If we are in development mode, proxy Firebase Storage URLs to avoid CORS
    if (import.meta.env.DEV && url.includes('storage.googleapis.com')) {
        return url.replace('https://storage.googleapis.com', '/firebase-storage');
    }

    return url;
};
