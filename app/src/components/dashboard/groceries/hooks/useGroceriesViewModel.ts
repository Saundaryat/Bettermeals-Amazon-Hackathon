import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useGroceryList, useGenerateGroceryList, useConfirmGroceryListOrder, useHouseholdPeriodsStatus, QUERY_KEYS } from '@/hooks/useHouseholdData';
import { transformApiDataToCategories } from '../utils/groceries.utils';
import { getHouseholdStatus } from '@/services/database';
import { ActiveView } from '../model/groceries.types';

/**
 * ViewModel hook for the Groceries component.
 * 
 * This hook encapsulates all the business logic, state management, and data fetching
 * required for the groceries view. It separates the presentation (UI) from the logic.
 * 
 * @param householdId - The ID of the household to fetch groceries for.
 * @param forNextWeek - Optional flag to fetch grocery list for next week (used in review workflow).
 */
export function useGroceriesViewModel(householdId?: string, forNextWeek?: boolean) {
    const queryClient = useQueryClient();

    // ============================================================================
    // Data Fetching
    // ============================================================================

    // Fetch the current grocery list for the household
    const {
        data: groceryList,
        isLoading: groceryListLoading,
        error: groceryListErrorObj
    } = useGroceryList(householdId || null, forNextWeek);

    const groceryListError = groceryListErrorObj ? (groceryListErrorObj as Error).message : null;

    // ============================================================================
    // Local State
    // ============================================================================

    const [activeView, setActiveView] = useState<ActiveView>('groceries');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Track checked items for "Mark as Ordered" functionality
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // State for multiple grocery list periods (e.g., 'Mon-Wed', 'Thu-Sat', 'full_week')
    const [activePeriod, setActivePeriod] = useState<string>('mon_wed');
    const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);

    // Track which periods have been confirmed in this session
    const [confirmedPeriods, setConfirmedPeriods] = useState<Set<string>>(new Set());

    // ============================================================================
    // Derived State & Effects
    // ============================================================================

    // Check if a valid grocery list exists in the response
    const hasGeneratedList = !!(
        groceryList?.grocery_plan?.weekly_grocery_plan ||
        (groceryList && 'categories' in groceryList)
    );

    /**
     * Effect to initialize available periods from the API response.
     * - Parses `grocery_lists` keys to find available periods.
     * - Fallbacks to 'full_week' for legacy data structures.
     * - Sets the default `activePeriod`.
     */
    useEffect(() => {
        if (groceryList?.grocery_plan?.weekly_grocery_plan) {
            const plan = groceryList.grocery_plan.weekly_grocery_plan;
            let periods: string[] = [];

            // Handle mid_week format: { splits: [...] }
            if (plan.splits && Array.isArray(plan.splits)) {
                periods = plan.splits.map((s: any) => s.label);
            }
            // Handle per_day format: { daily_lists: {...} }
            else if (plan.daily_lists && typeof plan.daily_lists === 'object') {
                const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                periods = dayOrder.filter(d => d in plan.daily_lists);
            }
            // Handle full_week format: { grocery_list: [...] }
            else if (plan.grocery_list && !plan.grocery_lists && !plan.splits) {
                periods = ['full_week'];
            }
            // Legacy format: { grocery_lists: {...} }
            else if (plan.grocery_lists) {
                const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const legacySortOrder = ['mon_wed', 'thu_sun', 'full_week'];
                const keys = Object.keys(plan.grocery_lists);

                // Check if keys are day names (per_day in legacy format)
                const areDayNames = keys.some(k => dayOrder.includes(k.toLowerCase()));

                if (areDayNames) {
                    // Sort by day of week, filter out non-day keys like 'full_week'
                    periods = dayOrder.filter(d => keys.includes(d));
                } else {
                    // Sort by legacy period order
                    periods = keys.sort((a, b) => {
                        const indexA = legacySortOrder.indexOf(a);
                        const indexB = legacySortOrder.indexOf(b);
                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        return a.localeCompare(b);
                    });
                }
            }

            setAvailablePeriods(periods);

            // determine default active period
            if (periods.length > 0) {
                setActivePeriod(periods[0]);
            }
        }
    }, [groceryList]);

    // Optimization: Cache status calls using React Query
    const periodStatus = useHouseholdPeriodsStatus(householdId, availablePeriods);

    // Sync cached statuses to local state
    useEffect(() => {
        if (periodStatus.isSuccess && periodStatus?.data) {
            const mw_status = periodStatus?.data?.data?.data['3_grocery_mw'];
            const ts_status = periodStatus?.data?.data?.data['5_grocery_ts'];
            const newConfirmed = new Set(confirmedPeriods);
            let hasChanges = false;

            // Check Mon-Wed: 3_grocery_mw
            if (mw_status === 'approved') {
                if (!newConfirmed.has('mon_wed')) {
                    newConfirmed.add('mon_wed');
                    hasChanges = true;
                }
            }
            // Check Thu-Sat: 5_grocery_ts
            if (ts_status === 'approved') {
                ['thu_sat', 'thu_sun'].forEach(period => {
                    if (availablePeriods.includes(period) && !newConfirmed.has(period)) {
                        newConfirmed.add(period);
                        hasChanges = true;
                    }
                });
            }

            if (hasChanges) {
                setConfirmedPeriods(newConfirmed);
            }
        }
    }, [periodStatus.data, periodStatus.isSuccess, availablePeriods, confirmedPeriods]);

    // ============================================================================
    // Generators & Mutations
    // ============================================================================

    // Mutation to generate a new grocery list
    const {
        mutate: generateList,
        isPending: isGenerating,
        error: generationErrorObj
    } = useGenerateGroceryList();

    const generationError = generationErrorObj ? (generationErrorObj as Error).message : null;

    const handleGenerateGroceryList = () => {
        if (!householdId) return;
        generateList({ householdId, forNextWeek });
    };

    // Mutation to confirm grocery list order
    const {
        mutate: confirmGroceryListOrder,
        isPending: isConfirmingOrder,
    } = useConfirmGroceryListOrder();

    // ============================================================================
    // Actions & Logic
    // ============================================================================

    const toggleItemChecked = (itemId: string) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const isItemChecked = (itemId: string) => checkedItems.has(itemId);

    /**
     * Helper to retrieve the specific array of grocery items based on the
     * currently selected `activePeriod`.
     */
    const getCurrentListItems = () => {
        const plan = groceryList?.grocery_plan?.weekly_grocery_plan;
        if (!plan) return [];

        // mid_week format: splits array
        if (plan.splits && Array.isArray(plan.splits)) {
            const split = plan.splits.find((s: any) => s.label === activePeriod);
            return split?.grocery_list || [];
        }
        // per_day format: daily_lists object
        if (plan.daily_lists && plan.daily_lists[activePeriod]) {
            return plan.daily_lists[activePeriod].grocery_list;
        }
        // full_week format: single grocery_list
        if (plan.grocery_list && !plan.grocery_lists) {
            return plan.grocery_list;
        }
        // Legacy format: grocery_lists object
        if (plan.grocery_lists && plan.grocery_lists[activePeriod]) {
            return plan.grocery_lists[activePeriod].grocery_list;
        }
        return [];
    };

    /**
     * Handles the 'Mark as Ordered' action.
     * Collects all checked items and confirms the order with the backend.
     */
    const handleMarkAsOrdered = () => {
        if (!householdId || checkedItems.size === 0) return;

        const currentListItems = getCurrentListItems();
        const allItems: any[] = [];

        // Find the full item objects for the checked IDs
        currentListItems.forEach((item: any) => {
            const itemId = item.prd_id || item.id;
            if (item.prd_id && checkedItems.has(item.prd_id)) {
                allItems.push(item);
            }
        });

        if (allItems.length === 0) return;

        confirmGroceryListOrder({ householdId, items: allItems, period: activePeriod }, {
            onSuccess: () => {
                setCheckedItems(new Set()); // Reset selection on success
                setConfirmedPeriods(prev => new Set(prev).add(activePeriod));
            },
            onError: (err) => {
                console.error("Failed to confirm grocery order", err);
            }
        });
    };

    // ============================================================================
    // Transformation & Filtering
    // ============================================================================

    // Transform raw API data into categorized format for the UI
    const processedCategories = transformApiDataToCategories(getCurrentListItems());

    const safeCategories = Array.isArray(processedCategories)
        ? processedCategories.map((category: any) => ({
            ...category,
            items: Array.isArray(category.items) ? category.items : []
        }))
        : [];

    // Filter categories based on selected category filter (e.g. 'Produce', 'Dairy')
    const filteredCategories = selectedCategory === 'all'
        ? safeCategories
        : safeCategories.filter((category: any) => category.name.toLowerCase() === selectedCategory.toLowerCase());

    // Additional Effects
    useEffect(() => {
        setSelectedCategory('all');
    }, [activeView]);


    return {
        // Data Props
        groceryListLoading,
        groceryListError,
        hasGeneratedList,
        filteredCategories,
        safeCategories,
        availablePeriods,
        activePeriod,
        selectedCategory,
        checkedItemsCount: checkedItems.size,
        isGenerating,
        generationError,
        isConfirmingOrder,
        isCurrentPeriodConfirmed: confirmedPeriods.has(activePeriod),

        // Action Props
        setActivePeriod,
        setSelectedCategory,
        toggleItemChecked,
        isItemChecked,
        handleGenerateGroceryList,
        handleMarkAsOrdered
    };
}
