# Image Preloading Utilities

This directory contains utilities for handling image loading, caching, and URL management within the application.

## Files

### 1. `imageUrl.ts`
Handles image URL transformation and proxying.

- **`PLACEHOLDER_IMAGE_URL`**: A constant pointing to the application's placeholder image. It uses `import.meta.env.BASE_URL` to ensure the path is correct relative to the app's deployment root.
- **`getProxiedImageUrl(url)`**: A utility function that solves CORS (Cross-Origin Resource Sharing) issues during local development.
    - **In Development**: It detects if a URL points to Firebase Storage (`storage.googleapis.com`) and rewrites it to use a local proxy path (`/firebase-storage/...`). This allows the browser to fetch images through the local dev server, bypassing strict CORS checks.
    - **In Production**: It returns the original URL as is.

### 2. `imagePreloader.ts`
Manages the preloading of images to improve user experience.

- **Purpose**: When a user views a weekly meal plan, this utility fetches all the images for that week in the background. This ensures that when the user switches between days, the images appear instantly from the browser cache instead of loading slowly.
- **`extractImageUrls(mealPlanData, addonsData)`**: Parses the complex nested structure of the meal plan and addons to find all image URLs. It handles different property names (e.g., `image_url` vs `imageurl`) to ensure robustness.
- **`preloadImage(url)`**: Loads a single image into a hidden HTML `Image` object. This forces the browser to download and cache the file. It uses `getProxiedImageUrl` to ensure the fetch succeeds even in local development.
- **`preloadMealPlanImages(...)`**: The main entry point used by the `Planner` component. It extracts all URLs and triggers the preloading process, reporting progress back to the UI.

## Usage Example

```typescript
import { preloadMealPlanImages } from '@/utils/imagePreloader';

// In a React component
useEffect(() => {
  if (mealPlanData) {
    preloadMealPlanImages(
      mealPlanData, 
      addonsData, 
      (loaded, total) => console.log(`Loaded ${loaded}/${total}`)
    );
  }
}, [mealPlanData]);
```
