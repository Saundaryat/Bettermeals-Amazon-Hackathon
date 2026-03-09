import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useWeeklyMealPlan, useGroceryList, useHouseholdDashboardInfo, useInventoryList } from "@/hooks/useHouseholdData";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/useHouseholdData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { householdId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // We don't need to pass this data down anymore, but keeping the hooks here 
  // ensures data is fetching as soon as the dashboard loads.
  // const {
  //   data: weeklyMealPlan,
  //   isLoading: isMealPlanLoading,
  //   error: mealPlanError
  // } = useWeeklyMealPlan(householdId || null);

  const {
    data: weeklyGroceryList,
    isLoading: isGroceryLoading,
    error: groceryError
  } = useGroceryList(householdId || null);

  const {
    data: householdDashboardInfo,
    isLoading: isDashboardInfoLoading
  } = useHouseholdDashboardInfo(householdId || null);

  const {
    data: inventoryList,
    isLoading: isInventoryLoading,
    error: inventoryError
  } = useInventoryList(householdId || null);


  console.log('Dashboard Data Debug:', {
    weeklyGroceryList,
    householdDashboardInfo,
    inventoryList,
    loading: { isGroceryLoading, isDashboardInfoLoading, isInventoryLoading },
    errors: { groceryError, inventoryError }
  });

  return (
    <div className="h-screen bg-gradient-to-br from-[#f7e6cf] via-white to-[#f7e6cf]">
      <DashboardLayout
        householdId={householdId}
      />
    </div>
  );
}

