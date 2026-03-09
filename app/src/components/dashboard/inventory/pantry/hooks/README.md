# Pantry Logic Explanation

## Overview
`usePantryLogic` is a custom React hook designed to manage the "Setup Pantry" or "Onboarding" experience. It helps users quickly populate their inventory with common staples and perishables, while respecting what they already have.

## Step by step flow

1. **Load Existing Inventory**: First, we check the database to see what the user already has at home.
2. **Prepare Suggestions**: We load our hardcoded "Default Staples" list (common items like salt, sugar, milk) and get their images/details.
3. **Filter Suggestions (The "Subtraction")**: We subtract the **Existing Inventory** from the **Default Staples**.
    - *Goal*: Don't suggest items the user already owns.
4. **User Selection**: We show the remaining suggestions to the user.
    - The user reviews this list and toggles items on or off.
5. **Calculate Final List (On Save)**: When the user clicks "Finish":
    - Take all the **New Items** the user just selected.
    - Add all the **Hidden Items** from their original inventory (items we didn't show them because they weren't in our suggestion list).
    - Exclude any suggested items the user explicitly unchecked.
6. **Update Database**: We replace the user's inventory in the backend with this new final list.


## Key Responsibilities

### 1. Data Fetching & Initialization
- **Fetches Inventory**: Uses `useInventoryList` to get the current household inventory.
- **Initializes State**: 
  - `inventoryItems`: A Set of IDs representing selected items. Initially populated with what the user already has (loaded from backend).
  - `initialInventoryItems`: A snapshot of the inventory at load time, used to calculate "newly selected" counts.

### 2. Filtering Default Staples
The hook takes a hardcoded list of `DEFAULT_STAPLES` and filters them dynamically:
- **Hydration**: Adds helper properties (like images) to the raw staple data.
- **Deduplication**: It checks if an item from `DEFAULT_STAPLES` already exists in the user's fetched inventory (matching by `id`, `prd_id`, or `name`).
- **Categorization**: 
  - **Staples**: Non-perishable items that are NOT already in the inventory.
  - **Perishables**: Perishable items that are NOT already in the inventory.

### 3. User Interaction
- **Toggling**: `toggleInventoryItem(itemId)` allows the user to select/deselect items from the suggested lists.
- **Tracking**: `hasItem(itemId)` checks if an item is currently selected.
- **Counts**: `newlySelectedCount` tracks how many *new* items the user has selected (excluding ones they started with).

### 4. Saving Changes
`saveInventory` is the critical function that commits changes to the backend:
- **Constructs Payload**:
  1. Iterates through `DEFAULT_STAPLES`. If an item is selected (`inventoryItems.has(id)`), it's added to the payload with `is_staple: true`.
  2. Preserves existing inventory:
     - If an existing inventory item is NOT visible in the suggestions (i.e., not a default staple), it is kept (user couldn't have unchecked it).
     - If it IS visible and still checked, it is kept.
     - If it IS visible and unchecked by the user, it is excluded (effectively deleted).
- **Updates Backend**: Calls `updateInventory` mutation.

## Usage
```typescript
const { 
  staples,          // List of suggested staples to display
  perishables,      // List of suggested perishables to display
  toggleInventoryItem, // Handler for user clicks
  handleFinishOnboarding // Handler for "Save" button
} = usePantryLogic(householdId);
```
