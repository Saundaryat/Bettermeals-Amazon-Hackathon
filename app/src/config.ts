// Centralized config for environment variables

// Set this to true for local development, false for production or staging
// Defaults to true if NODE_ENV is development (when running vite dev server)
export const dev = import.meta.env.VITE_DEV_MODE === 'true' ||
  (import.meta.env.VITE_DEV_MODE !== 'false' && import.meta.env.DEV);

export const backendUrl = "/api/v1";

// Toggle to enable/disable mock data fallback for MealDetailModal when API fails
// Defaults to true in development, false in production
export const ENABLE_MOCK_DATA_FALLBACK = dev;
