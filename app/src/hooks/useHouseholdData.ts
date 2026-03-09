import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { getHouseholdDashboardInfo, fetchHouseholdInventoryList, fetchHouseholdWeeklyMealPlan, fetchDashboardGroceryList, saveWeeklyMealPlan, updateHouseholdInventory, generateWeeklyGroceryPlan, generateWeeklyMealPlan, registerHouseholdAction, updateHouseholdStatus, getHouseholdStatus, fetchPendingActions, updateWorkflowStatus, getWorkflowStatusV2, logWorkflowStatusV2 } from "../services/database";
import { WeeklyMealPlanResponse, GroceryListResponse, HouseholdDashboardInfo, InventoryListResponse } from "../services/types";
import { PendingActionsResponse } from "@/components/dashboard/actions/types";

// Keys for React Query cache
export const QUERY_KEYS = {
    mealPlan: (householdId: string, forNextWeek: boolean) => ["weeklyMealPlan", householdId, forNextWeek ? "next_week" : "current_week"],
    groceryList: (householdId: string, forNextWeek?: boolean) => forNextWeek ? ["weeklyGroceryList", householdId, "next_week"] : ["weeklyGroceryList", householdId],
    dashboardInfo: (householdId: string) => ["householdDashboardInfo", householdId],
    inventoryList: (householdId: string) => ["householdInventoryList", householdId],
    pendingActions: (householdId: string) => ["pendingActions", householdId],
    workflowStatusV2: (householdId: string, week?: string) => week ? ["workflowStatusV2", householdId, week] : ["workflowStatusV2", householdId],
};

export function useWeeklyMealPlan(householdId: string | null, forNextWeek: boolean = false) {
    return useQuery<WeeklyMealPlanResponse>({
        queryKey: QUERY_KEYS.mealPlan(householdId || "", forNextWeek),
        queryFn: () => fetchHouseholdWeeklyMealPlan(householdId!, forNextWeek),
        enabled: !!householdId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useGroceryList(householdId: string | null, forNextWeek: boolean = false) {
    return useQuery<GroceryListResponse>({
        queryKey: QUERY_KEYS.groceryList(householdId || "", forNextWeek),
        queryFn: () => fetchDashboardGroceryList(householdId!, forNextWeek),
        enabled: !!householdId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useInventoryList(householdId: string | null) {
    return useQuery<InventoryListResponse>({
        queryKey: QUERY_KEYS.inventoryList(householdId || ""),
        queryFn: () => fetchHouseholdInventoryList(householdId!),
        enabled: !!householdId,
        staleTime: 1000 * 60 * 60 * 12, // 12 hrs
    });
}

export function useHouseholdDashboardInfo(householdId: string | null) {
    return useQuery<HouseholdDashboardInfo>({
        queryKey: QUERY_KEYS.dashboardInfo(householdId || ""),
        queryFn: () => getHouseholdDashboardInfo(householdId!),
        enabled: !!householdId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

export function useUpdateWeeklyMealPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, forNextWeek, plan, userId }: { householdId: string, forNextWeek: boolean, plan: any, userId: string }) =>
            saveWeeklyMealPlan(householdId, forNextWeek, plan, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mealPlan(variables.householdId, variables.forNextWeek) });
        },
    });
}

export function useUpdateInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, inventoryList }: { householdId: string, inventoryList: any[] }) =>
            updateHouseholdInventory(householdId, inventoryList),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryList(variables.householdId) });
        },
    });
}

export function useGenerateGroceryList() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, forNextWeek = false, splitMode = 'per_day' }: {
            householdId: string,
            forNextWeek?: boolean,
            splitMode?: 'full_week' | 'mid_week' | 'per_day'
        }) =>
            generateWeeklyGroceryPlan(householdId, forNextWeek, splitMode),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groceryList(variables.householdId) });
        },
    });
}

export function useGenerateMealPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, forNextWeek }: { householdId: string, forNextWeek: boolean }) =>
            generateWeeklyMealPlan(householdId, forNextWeek),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mealPlan(variables.householdId, variables.forNextWeek) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryList(variables.householdId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groceryList(variables.householdId) });
        },
    });
}

export function useConfirmGroceryListOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ householdId, items, period }: { householdId: string, items: any[], period?: string }) => {
            if (!householdId) throw new Error("Household ID required");

            // 1. Register Action (Optional but good for history)
            const actionResult = await registerHouseholdAction(householdId, "GROCERY_LIST_CONFIRMED", {
                timestamp: new Date().toISOString(),
                item_count: items.length,
                period: period
            });
            // Not throwing on action registration failure to ensure workflow status update proceeds if possible, 
            // or we can throw. Given previous code threw, we can keep throwing or logging.
            if (!actionResult.success) console.error("Failed to register action", actionResult.error);

            // 2. Determine Workflow Field
            let field = '';
            // Match 'mon_wed' or similar variations
            if (period === 'mon_wed' || period?.startsWith('mon')) {
                field = '3_grocery_mw';
            } else if (period === 'thu_sat' || period === 'thu_sun' || period?.startsWith('thu')) {
                field = '5_grocery_ts';
            } else {
                console.warn("Unknown period for workflow update:", period);
                return { success: true };
            }

            // 3. Update Workflow Status
            const statusResult = await updateWorkflowStatus(householdId, field, 'approved');
            if (!statusResult.success) throw new Error(statusResult.error);

            return { success: true };
        },
        onSuccess: (_, variables) => {
            // Invalidate queries to refresh data on screen if needed
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingActions(variables.householdId) });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryList(variables.householdId) });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.groceryList(variables.householdId) });
        }
    });
}


export function useHouseholdPeriodsStatus(householdId: string | null, periods: string[]) {
    return useQuery({
        queryKey: ["householdStatus", householdId],
        queryFn: () => getHouseholdStatus(householdId!),
        enabled: !!householdId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function usePendingActions(householdId: string | null) {
    return useQuery<PendingActionsResponse>({
        queryKey: QUERY_KEYS.pendingActions(householdId || ""),
        queryFn: () => {
            if (!householdId) throw new Error("Household ID required");
            return fetchPendingActions(householdId);
        },
        enabled: !!householdId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useUpdateWorkflowStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, field, status }: { householdId: string, field: string, status: string }) =>
            updateWorkflowStatus(householdId, field, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingActions(variables.householdId) });
        },
    });
}

export function useWorkflowStatusV2(householdId: string | null, week?: string) {
    return useQuery({
        queryKey: QUERY_KEYS.workflowStatusV2(householdId || "", week),
        queryFn: async () => {
            if (!householdId) throw new Error("Household ID required");
            const result = await getWorkflowStatusV2(householdId, week);
            // If failure, we might want to return null or throw depending on UI needs.
            // For now, return result as is, or data if success.
            // The result structure is { success, data, error, status? }
            return result;
        },
        enabled: !!householdId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useLogWorkflowStatusV2() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ householdId, statusData }: { householdId: string, statusData: any }) =>
            logWorkflowStatusV2(statusData, householdId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workflowStatusV2(variables.householdId) });
            // Also invalidate old pending actions if they are still relevant for backward compatibility
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingActions(variables.householdId) });
        },
    });
}
