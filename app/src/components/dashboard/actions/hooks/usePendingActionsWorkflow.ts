/**
 * usePendingActionsWorkflow.ts
 * 
 * This custom hook manages the entire state and logic for the PendingActions 
 * multi-step workflow. It orchestrates:
 * 
 * WORKFLOW STEPS:
 *   Step 1: Review & approve the meal plan for next week
 *   Step 2: Update pantry inventory (mark items you already have)
 *   Step 3: Review the generated grocery list
 *   Step 4: Success screen (all steps complete)
 * 
 * RESPONSIBILITIES:
 *   - Fetches workflow status from backend to determine current step
 *   - Fetches meal plan data for next week
 *   - Manages UI state for meal selection and day navigation
 *   - Provides action handlers for step transitions
 *   - Handles meal plan generation when no plan exists
 * 
 * The hook returns a `WorkflowState` object containing all state and handlers
 * needed by the PendingActions component.
 */

import { useState, useEffect, useCallback } from 'react';
import { addWeeks, format, startOfWeek } from 'date-fns';
import {
    useWeeklyMealPlan,
    useUpdateWeeklyMealPlan,
    useGenerateGroceryList,
    useGenerateMealPlan,
    useWorkflowStatusV2,
    useLogWorkflowStatusV2,
    useHouseholdDashboardInfo
} from '@/hooks/useHouseholdData';
import { useAuth } from '@/hooks/useAuth';
import { useMealReplacement } from '@/hooks/useMealReplacement';
import { useImagePreloading } from '@/hooks/useImagePreloading';
import { usePlannerState } from '@/hooks/usePlannerState';
import {
    transformRealMealPlanToUIFormat,
    DAYS_OF_WEEK_KEYS,
    emptyDayMeals
} from '@/components/dashboard/meal_planner/PlannerUtils';
import { MealDetails } from '@/components/dashboard/meal_modal/types';

/**
 * WorkflowState Interface
 * 
 * Defines the complete shape of data and handlers returned by this hook.
 * Grouped by functional area for clarity.
 */
export interface WorkflowState {
    // ─────────────────────────────────────────────────────────────────────────
    // STEP MANAGEMENT
    // Controls which step of the workflow is currently active (1-4)
    // ─────────────────────────────────────────────────────────────────────────
    currentStep: number;
    setCurrentStep: (step: number) => void;

    // ─────────────────────────────────────────────────────────────────────────
    // LOADING & ERROR STATES
    // Used to show loading spinners or error messages in the UI
    // ─────────────────────────────────────────────────────────────────────────
    isLoading: boolean;          // True while fetching workflow status or meal plan
    shouldShowError: boolean;    // True if a critical error occurred

    // ─────────────────────────────────────────────────────────────────────────
    // PLANNER UI STATE
    // Manages the weekly planner view (day selection, meal detail modal)
    // These come from usePlannerState hook
    // ─────────────────────────────────────────────────────────────────────────
    viewMode: string;                                      // 'today' | 'weekly' | 'upcoming'
    selectedDay: number;                                   // 0-6 (Monday-Sunday)
    handleDayChange: (day: number) => void;                // Switch displayed day
    selectedMealId: string | null;                         // ID of meal clicked for details
    selectedMealImage: string | null;                      // Image URL for selected meal
    isMealDetailOpen: boolean;                             // Whether detail modal is open
    handleMealClick: (mealId: string, imageUrl?: string) => void;  // Open meal detail
    handleCloseMealDetail: () => void;                     // Close meal detail modal

    // ─────────────────────────────────────────────────────────────────────────
    // MEAL DATA
    // Raw and transformed meal plan data for display
    // ─────────────────────────────────────────────────────────────────────────
    realMealPlanData: any;           // Raw meals object from API (keyed by day)
    realAddonsData: any;             // Raw addons object from API (snacks, drinks, etc)
    hasRealMealPlan: boolean;        // True if meal plan exists and has meals
    transformedRealMeals: any;       // Meals transformed for UI display format
    currentDayMealsFiltered: any;    // Filtered meals for the currently selected day
    imagesPreloaded: boolean;        // True when meal images are cached

    // ─────────────────────────────────────────────────────────────────────────
    // DATE INFO
    // Used for displaying date ranges in headers
    // ─────────────────────────────────────────────────────────────────────────
    nextWeekStart: Date;     // The Monday of next week
    dateRangeStr: string;    // Formatted string like "Week of Feb 10-16"

    // ─────────────────────────────────────────────────────────────────────────
    // ACTION HANDLERS
    // Functions to trigger workflow transitions
    // ─────────────────────────────────────────────────────────────────────────
    handleApproveMeals: () => void;      // Step 1 → 2: Approve the meal plan
    handleFinishGrocery: () => void;     // Step 3 → 4: Complete the workflow
    handleReplaceMeal: (newMealDetails: MealDetails) => Promise<void>;  // Swap a meal

    // ─────────────────────────────────────────────────────────────────────────
    // INVENTORY STEP STATE (Step 2)
    // Manages state specific to the inventory update step
    // ─────────────────────────────────────────────────────────────────────────
    inventorySelectionCount: number;                       // Number of items selected
    setInventorySelectionCount: (count: number) => void;   // Update selection count
    inventorySaveCallback: (() => void) | null;            // Callback to save inventory
    setInventorySaveCallback: (cb: (() => void) | null) => void;  // Set save callback
    handleInventoryUpdated: () => void;  // Step 2 → 3: After inventory saved

    // ─────────────────────────────────────────────────────────────────────────
    // LOADING STATES FOR ACTIONS
    // Used to disable buttons during async operations
    // ─────────────────────────────────────────────────────────────────────────
    isUpdatingStatus: boolean;       // True while updating workflow status
    isGeneratingGroceries: boolean;  // True while generating grocery list

    // ─────────────────────────────────────────────────────────────────────────
    // MEAL PLAN GENERATION (when no plan exists)
    // Used in Step 1 when user needs to generate a meal plan first
    // ─────────────────────────────────────────────────────────────────────────
    isGeneratingMealPlan: boolean;           // True while AI generates meal plan
    mealPlanGenerationError: string | null;  // Error message if generation failed
    handleGenerateMealPlan: () => void;      // Trigger meal plan generation
}

/**
 * Main Hook Implementation
 * 
 * @param householdId - The ID of the household for which to manage the workflow
 * @returns WorkflowState object containing all state and handlers
 */
export function usePendingActionsWorkflow(householdId: string): WorkflowState {

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: UI STATE MANAGEMENT
    // Local state for tracking which step we're on and planner interactions
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Current step in the workflow (1-4)
     * This is initially set to 1, but gets updated by the useEffect below
     * based on the workflow status from the backend.
     */
    const [currentStep, setCurrentStep] = useState(1);

    /**
     * Planner state from shared hook
     * - viewMode: Not used here but kept for interface compatibility
     * - selectedDay: Which day (0-6) is selected in the week view
     * - handleDayChange: Function to change the selected day
     * - selectedMealId/Image: For the meal detail modal
     * - isMealDetailOpen: Whether the modal is showing
     * - handleMealClick: Opens the meal detail modal for a specific meal
     * - handleCloseMealDetail: Closes the modal
     */
    const {
        viewMode,
        selectedDay,
        handleDayChange,
        selectedMealId,
        selectedMealImage,
        isMealDetailOpen,
        handleMealClick,
        handleCloseMealDetail
    } = usePlannerState(0); // Start with Monday (index 0)

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: DATA FETCHING
    // Fetch workflow status and meal plan data from the backend
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Calculate the target week dates
     * We always work with NEXT week's meal plan in this workflow
     */
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const nextWeekStart = addWeeks(currentWeekStart, 1);

    /**
     * Fetch the current workflow status (V2 API)
     * This tells us which steps have been completed:
     * - meal_status: 'pending' | 'approved'
     * - inventory_status: 'pending' | 'approved'
     * - grocery_list_status: 'pending' | 'approved'
     */
    const {
        data: workflowStatusResult,
        isLoading: isStatusLoading,
        error: statusError
    } = useWorkflowStatusV2(householdId);

    /**
     * Fetch the meal plan for NEXT week (forNextWeek: true)
     * This contains:
     * - weekly_meal_plan.meals: { monday: { breakfast: [...], lunch: [...], ... }, ... }
     * - weekly_meal_plan.addons: { monday: { snacks: [...], ... }, ... }
     */
    const {
        data: weeklyMealPlan,
        isLoading: isMealPlanLoading,
        error: mealPlanError
    } = useWeeklyMealPlan(householdId, true); // true = forNextWeek

    /**
     * Fetch household users to display names in addons
     */
    const { data: dashboardInfo } = useHouseholdDashboardInfo(householdId);

    /**
     * Auth state - needed for meal replacement operations
     */
    const { user } = useAuth();

    /**
     * Mutation to update the meal plan (used when replacing a meal)
     */
    const { mutate: updateWeeklyMealPlan } = useUpdateWeeklyMealPlan();

    /**
     * Mutation to update workflow status in the backend
     * Called when user completes a step (approve meals, confirm inventory, finish)
     */
    const { mutate: logStatus, isPending: isUpdatingStatus } = useLogWorkflowStatusV2();

    /**
     * Mutation to generate the grocery list from the meal plan
     * Called after inventory is confirmed (Step 2 → 3)
     */
    const { mutate: generateGroceryList, isPending: isGeneratingGroceries } = useGenerateGroceryList();

    /**
     * Mutation to generate a new meal plan using AI
     * Called when no meal plan exists and user clicks "Generate Meal Plan"
     */
    const {
        mutate: generateMealPlan,
        isPending: isGeneratingMealPlan,
        error: mealPlanGenerationErrorObj
    } = useGenerateMealPlan();

    // Extract error message string from error object
    const mealPlanGenerationError = mealPlanGenerationErrorObj
        ? (mealPlanGenerationErrorObj as Error).message
        : null;

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2B: INVENTORY STEP STATE
    // State specific to the inventory update step (Step 2)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Track how many inventory items the user has selected
     * This is displayed in the "Confirm Inventory (X items selected)" button
     */
    const [inventorySelectionCount, setInventorySelectionCount] = useState(0);

    /**
     * Callback provided by InventoryStep component to save the selections
     * We store it here so the parent can trigger save from the footer button
     */
    const [inventorySaveCallback, setInventorySaveCallback] = useState<(() => void) | null>(null);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: STEP DETERMINATION LOGIC
    // Automatically determine which step to show based on workflow status
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * This effect runs whenever workflowStatusResult changes (after fetch completes)
     * It determines the current step based on which statuses are approved:
     * 
     * DECISION TREE:
     * ├─ No workflow found (404) → Step 4 (Success - nothing to do)
     * ├─ meal_status !== 'approved' → Step 1 (Review meals)
     * ├─ meal_status === 'approved'
     * │  ├─ inventory_status !== 'approved' → Step 2 (Update inventory)
     * │  ├─ inventory_status === 'approved'
     * │  │  ├─ grocery_list_status !== 'approved' → Step 3 (Review groceries)
     * │  │  └─ grocery_list_status === 'approved' → Step 4 (Success)
     */
    useEffect(() => {
        // CASE: Workflow not found or API returned error/empty
        // This means the workflow for this week doesn't exist yet - start from Step 1
        // NOTE: This is different from "all steps completed". A missing workflow means
        // the user hasn't started the approval process yet for this week.
        if (workflowStatusResult && (!workflowStatusResult.success || !workflowStatusResult.data)) {
            setCurrentStep(1); // Start fresh - show meal review (or generate if no plan)
            return;
        }

        // CASE: Workflow exists, determine step from status fields
        if (workflowStatusResult && workflowStatusResult.data) {
            const status = workflowStatusResult.data;
            const { meal_status, inventory_status, grocery_list_status } = status;

            // Check meal status first (must be approved to proceed)
            if (meal_status === 'approved') {
                // Meal approved, check inventory
                if (inventory_status === 'approved') {
                    // Inventory approved, check grocery list
                    if (grocery_list_status === 'approved') {
                        // All done! Show success screen
                        setCurrentStep(4);
                    } else {
                        // Grocery list pending, show grocery review
                        setCurrentStep(3);
                    }
                } else {
                    // Inventory not yet confirmed, show inventory step
                    setCurrentStep(2);
                }
            } else {
                // Meal plan not yet approved, start from step 1
                setCurrentStep(1);
            }
        }
    }, [workflowStatusResult]);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: DERIVED STATE
    // Compute values from the fetched data for easier consumption by UI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Extract raw meal plan data from the API response
     * This is the nested structure: { monday: { breakfast: [...], ... }, ... }
     */
    const realMealPlanData = weeklyMealPlan?.weekly_meal_plan?.meals;
    const realAddonsData = weeklyMealPlan?.weekly_meal_plan?.addons;

    /**
     * Check if we actually have a meal plan with meals
     * Used to decide whether to show MealReviewStep or EmptyMealPlanState
     */
    const hasRealMealPlan = !!realMealPlanData && Object.keys(realMealPlanData).length > 0;

    /**
     * Meal replacement hook
     * Provides handleReplaceMeal function to swap one meal for another
     */
    const { handleReplaceMeal } = useMealReplacement({
        householdId,
        user,
        weeklyMealPlan,
        selectedMealId,
        forNextWeek: true, // Always working with next week
        updateWeeklyMealPlan,
        onSuccess: handleCloseMealDetail // Close modal after successful replacement
    });

    /**
     * Image preloading hook
     * Preloads meal images in the background for smoother UX
     */
    const { imagesPreloaded } = useImagePreloading(
        hasRealMealPlan,
        realMealPlanData,
        realAddonsData
    );

    /**
     * Combined loading state - true if either query is still loading
     */
    const isLoading = isStatusLoading || isMealPlanLoading;

    /**
     * Combined error - first error from either query
     */
    const error = statusError || mealPlanError;

    /**
     * Determine if we should show an error state
     * We DON'T show error if:
     * - Workflow is missing (404) - this is expected, means success
     * - We're already on step 4 - user completed everything
     */
    const isWorkflowMissing = workflowStatusResult && (!workflowStatusResult.success || !workflowStatusResult.data);
    const shouldShowError = (error || !weeklyMealPlan) && !isWorkflowMissing && currentStep !== 4;

    // Create user map for displaying names in addons
    const userMap: Record<string, string> = dashboardInfo?.users?.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
    }, {} as Record<string, string>) || {};

    /**
     * Transform raw meal data into UI-friendly format
     * Converts: { monday: { breakfast: [meal1, meal2], ... } }
     * To a format the WeeklyPlannerView component can render
     */
    const transformedRealMeals = hasRealMealPlan
        ? transformRealMealPlanToUIFormat(realMealPlanData, realAddonsData, userMap)
        : null;

    /**
     * Get meals for the currently selected day
     * DAYS_OF_WEEK_KEYS maps 0→'monday', 1→'tuesday', etc.
     */
    const dayKey = DAYS_OF_WEEK_KEYS[selectedDay];
    const currentDayMealsFiltered = transformedRealMeals?.[dayKey] || emptyDayMeals;

    /**
     * Format the date range for display in headers
     * Example: "Week of Feb 10-16"
     */
    const dateRangeStr = `Week of ${format(nextWeekStart, 'MMM d')}-${format(addWeeks(nextWeekStart, 1), 'd')}`;

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Get the current workflow status data or a default object
     * Used when building the next status to send to the API
     */
    const getCurrentStatusData = useCallback(() => {
        return workflowStatusResult?.data || { household_id: householdId };
    }, [workflowStatusResult, householdId]);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 6: ACTION HANDLERS
    // Functions that trigger workflow state transitions
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * STEP 1 → STEP 2: Approve Meals
     * Called when user clicks "Approve Weekly Plan"
     * 
     * What it does:
     * 1. Gets current workflow status
     * 2. Sets meal_status to 'approved'
     * 3. Sends update to backend
     * 4. On success, moves to step 2 (inventory)
     */
    const handleApproveMeals = useCallback(() => {
        if (!householdId) return;

        const currentStatus = getCurrentStatusData();
        const nextStatus = {
            ...currentStatus,
            household_id: householdId,
            meal_status: 'approved',
            updated_at: new Date().toISOString()
        };

        console.log('[DEBUG] Approving meals...', nextStatus);
        logStatus({ householdId, statusData: nextStatus }, {
            onSuccess: () => {
                console.log('[DEBUG] Meal status updated.');
                setCurrentStep(2); // Move to inventory step
            },
            onError: (err) => console.error('[DEBUG] Failed to approve meals', err)
        });
    }, [householdId, getCurrentStatusData, logStatus]);

    /**
     * STEP 3 → STEP 4: Finish Grocery Review
     * Called when user clicks "Finish" on the grocery list step
     * 
     * What it does:
     * 1. Gets current workflow status
     * 2. Removes any legacy grocery_list field
     * 3. Sets grocery_list_status to 'approved'
     * 4. Sends update to backend
     * 5. On success, moves to step 4 (success screen)
     */
    const handleFinishGrocery = useCallback(() => {
        if (!householdId) return;
        console.log('[DEBUG] Finishing grocery step...');

        const currentStatus = { ...getCurrentStatusData() };

        // Clean up legacy data format if present
        if ('grocery_list' in currentStatus) {
            delete (currentStatus as any).grocery_list;
        }

        const nextStatus = {
            ...currentStatus,
            household_id: householdId,
            grocery_list_status: 'approved',
            updated_at: new Date().toISOString()
        };

        logStatus({ householdId, statusData: nextStatus }, {
            onSuccess: () => {
                console.log('[DEBUG] Grocery status updated. Showing Success Screen...');
                setCurrentStep(4); // Move to success screen
            },
            onError: (err) => console.error('[DEBUG] Failed to update grocery status', err)
        });
    }, [householdId, getCurrentStatusData, logStatus]);

    /**
     * STEP 2 → STEP 3: After Inventory Updated
     * Called when InventoryStep confirms the pantry selections have been saved
     * 
     * What it does:
     * 1. Generates grocery list based on meal plan - inventory
     * 2. On success, updates workflow status (inventory_status: 'approved')
     * 3. Moves to step 3 (grocery list review)
     * 
     * This is a 2-step async process:
     * save inventory → generate grocery list → update status → step 3
     */
    const handleInventoryUpdated = useCallback(() => {
        console.log('[DEBUG] Inventory updated. Generating groceries...');

        // First, generate the grocery list
        generateGroceryList({ householdId, forNextWeek: true }, {
            onSuccess: () => {
                console.log('[DEBUG] Groceries generated. Updating workflow status...');

                const currentStatus = { ...getCurrentStatusData() };
                // Clean up legacy data format
                if ('grocery_list' in currentStatus) {
                    delete (currentStatus as any).grocery_list;
                }

                const nextStatus = {
                    ...currentStatus,
                    household_id: householdId,
                    inventory_status: 'approved',
                    updated_at: new Date().toISOString()
                };

                // Then update the workflow status
                logStatus({ householdId, statusData: nextStatus }, {
                    onSuccess: () => {
                        console.log('[DEBUG] Inventory status updated.');
                        setCurrentStep(3); // Move to grocery review
                    },
                    onError: (err) => {
                        console.error('[DEBUG] Failed to update inventory status', err);
                    }
                });
            },
            onError: (err) => {
                console.error('[DEBUG] Failed to generate groceries', err);
            }
        });
    }, [householdId, getCurrentStatusData, generateGroceryList, logStatus]);

    /**
     * Generate Meal Plan
     * Called when no meal plan exists and user clicks "Generate Meal Plan"
     * 
     * What it does:
     * 1. Calls the AI meal generation service
     * 2. Creates a personalized meal plan for next week
     * 3. React Query will refetch and update hasRealMealPlan
     */
    const handleGenerateMealPlan = useCallback(() => {
        if (!householdId) return;
        console.log('[DEBUG] Generating meal plan for next week...');
        generateMealPlan({ householdId, forNextWeek: true });
    }, [householdId, generateMealPlan]);

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 7: RETURN VALUE
    // Expose all state and handlers for the PendingActions component
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        // Step management
        currentStep,
        setCurrentStep,

        // Loading & Error states
        isLoading,
        shouldShowError,

        // Planner UI state
        viewMode,
        selectedDay,
        handleDayChange,
        selectedMealId,
        selectedMealImage,
        isMealDetailOpen,
        handleMealClick,
        handleCloseMealDetail,

        // Meal data
        realMealPlanData,
        realAddonsData,
        hasRealMealPlan,
        transformedRealMeals,
        currentDayMealsFiltered,
        imagesPreloaded,

        // Date info
        nextWeekStart,
        dateRangeStr,

        // Action handlers
        handleApproveMeals,
        handleFinishGrocery,
        handleReplaceMeal,

        // Inventory step state
        inventorySelectionCount,
        setInventorySelectionCount,
        inventorySaveCallback,
        setInventorySaveCallback,
        handleInventoryUpdated,

        // Loading states for actions
        isUpdatingStatus,
        isGeneratingGroceries,

        // Meal plan generation
        isGeneratingMealPlan,
        mealPlanGenerationError,
        handleGenerateMealPlan
    };
}
