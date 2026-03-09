# MealDetailModal Component Analysis

## Overview
`MealDetailModal` is a React component responsible for displaying detailed information about a specific meal or recipe in a modal overlay. It provides a rich user interface containing nutritional information, ingredients, cooking steps, and dietary metadata.

**Location:** `app/src/components/MealDetailModal.tsx`

## Core Functionality

### 1. Modal Control & Layout
- **Trigger:** The modal is controlled via the `isOpen` prop.
- **Scroll Locking:** When open, it locks the `document.body` scroll to prevent the background from moving while the user interacts with the modal. This is handled in a `useEffect`.
- **Responsive Design:**
  - **Desktop:** Split view with the image on the left and scrollable details on the right.
  - **Mobile:** Stacked view with the image at the top and details below.
  - **Backdrop:** A blurred semi-transparent black overlay (`backdrop-blur-sm`).

### 2. Data Fetching Strategy
The component employs a hybrid data fetching strategy, though currently heavily reliant on mock data for development.

- **Initialization:**
  - Accepts `mealId` and optional `initialImageUrl`.
  - On open, it **immediately sets hardcoded Mock Data** (`Ragi Dosa Tomato Chutney`).
  - Triggers `fetchMealData()` asynchronously.

- **Source Logic:**
  - Differentiates between "Regular Meals" and "Add-ons" based on checking the `mealId` string:
    - Checks if `mealId` starts with `desc_` or contains `addon`, `_bowl`, or `_salad`.
    - Calls `fetchAddonDetails` or `fetchMealDetails` accordingly from `@/services/database`.

### 3. State Management
- `mealDetails`: Holds the `MealDetails` object (name, ingredients, nutrition, etc.).
- `loading`: Boolean state for UI feedback.
- `error`: Stores error messages if fetching fails.

## UI Sections

1.  **Header:** Displays the meal name, author, and a link to the original recipe. Includes a close button.
2.  **Image Display:**
    - Handles loading states with skeletons.
    - Falls back to `initialImageUrl` or a default placeholder if the main image fails to load.
3.  **Quick Stats:** Grid displaying Skill Level, Cook Time, Servings, Serving Size, and Estimated Cost.
4.  **Nutritional Info:** A detailed panel showing Calories, Carbs, Protein, Fats, and Daily Diet Percentage.
5.  **Ingredients Grid:** Visual grid of ingredients with individual images (fetched from Firebase Storage).
6.  **Cooking Steps:** Numbered list of instructions.

---

## Identified Bugs & Critical Issues

### 1. Mock Data Race Condition (Critical UX)
**Issue:** The component explicitly sets mock data *before* fetching real data.
```typescript
// Lines 69-99
const mockData: MealDetails = { ... };
setMealDetails(mockData);
// Lines 105
fetchMealData();
```
**Impact:** Users will **always** see the "Ragi Dosa" data for a split second (or longer) before the real meal data loads. If the real load is fast, it causes a jarring flicker. If it fails, the user sees incorrect data masquerading as real data.

### 2. Error Handling Logic
**Issue:** In the `catch` block of `fetchMealData`:
```typescript
} catch (err) {
  // ...
  setMealDetails(mockData); // Resets to Ragi Dosa on error
  setError(...);
}
```
**Impact:** If the API fails, the user is shown the mock "Ragi Dosa" meal instead of an empty state or just the error message. This is confusing in a production app.

### 3. Fragile Add-on Detection
**Issue:**
```typescript
const isAddon = mealId.startsWith('desc_') || mealId.includes('addon') || mealId.includes('_bowl') || mealId.includes('_salad');
```
**Impact:** Relying on string inclusion for ID types is brittle. If a regular meal has "salad" in its ID (e.g., `chicken_salad_delight`), it might be incorrectly fetched as an add-on.

### 4. Hardcoded Image URLs & Fallbacks
**Issue:**
- The component uses specific unsplash URLs as hardcoded fallbacks in `onError` handlers.
- Mock data contains hardcoded Firebase Storage URLs.
**Impact:** If these external resources go down or change, the app breaks.

---

## Areas for Improvement

### 1. Refactor Data Fetching
- **Recommendation:** Remove the inline mock data setting. Use a proper loading state (skeleton UI) until the real data arrives.
- **Action:** Move the mock data to a separate file or use it ONLY when `process.env.NODE_ENV === 'development'` and the API fails (explicitly labeled as "Demo Mode").

### 2. Enhanced Error UI
- **Recommendation:** If fetching fails, display a "Retry" button and a friendly error message, rather than showing fake data.

### 3. Custom Hook Pattern
- **Recommendation:** Extract the fetching logic into a custom hook, e.g., `useMealDetails(mealId)`.
- **Benefit:** Separates UI concerns from data fetching logic, making the component cleaner and the logic reusable.

### 4. Accessibility (a11y)
- **Recommendation:**
  - Use a native `<dialog>` element or React Portal for better screen reader support.
  - Implement focus trapping within the modal so tabbing doesn't escape to the background.
  - Ensure the "Close" button has a visible focus state.

### 5. Type Safety
- **Recommendation:** Strengthen the `MealDetails` interface. Currently, many fields are optional (`?`), which forces a lot of conditional rendering. If the backend guarantees certain fields, remove the optional flag to simplify the UI code.
