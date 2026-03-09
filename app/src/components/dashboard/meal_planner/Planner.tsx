import React, { useEffect, useRef } from 'react';
import { format, addWeeks, startOfWeek, addDays } from 'date-fns';
import MealDetailModal from '@/components/dashboard/meal_modal/MealDetailModal';
import { useWeeklyMealPlan, useGenerateMealPlan, useUpdateWeeklyMealPlan, useUpdateWorkflowStatus, useHouseholdDashboardInfo } from '@/hooks/useHouseholdData';
import { useAuth } from '@/hooks/useAuth';
import {
  emptyDayMeals,
  transformRealMealPlanToUIFormat,
  DAYS_OF_WEEK_KEYS,
  isDayEmpty
} from './PlannerUtils';
import { EmptyMealPlanState } from './EmptyMealPlanState';
import { PlannerHeader } from './PlannerHeader';
import { ViewModeToggle } from './ViewModeToggle';
import { WeeklyViewToggle } from './WeeklyViewToggle';
import { DailyMealList } from './DailyMealList';
import { WeeklyPlannerView } from './WeeklyPlannerView';
import { WeeklyDaySelector } from './WeeklyDaySelector';
import { WeeklyInsights } from '@/components/dashboard/insights/WeeklyInsights';
import { PlannerSkeleton } from './PlannerSkeleton';
import { PlannerErrorState } from './PlannerErrorState';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useImagePreloading } from '@/hooks/useImagePreloading';
import { useMealReplacement } from '@/hooks/useMealReplacement';

interface PlannerProps {
  householdId?: string;
}

export default function Planner({ householdId }: PlannerProps) {
  // 1. UI State Management
  const {
    viewMode,
    setViewMode,
    hasUserChangedView,
    hasUrlViewParam,
    selectedDay,
    handleDayChange,
    selectedMealId,
    selectedMealImage,
    isMealDetailOpen,
    handleMealClick,
    handleCloseMealDetail
  } = usePlannerState();

  const [activeTab, setActiveTab] = React.useState<'meals' | 'insights'>('meals');

  // Track if we've done the initial day selection (one-time only)
  const hasInitializedDay = useRef(false);

  // 2. Data Fetching Prep
  // Calculate target week based on view mode
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextWeekStart = addWeeks(currentWeekStart, 1);

  const currentYearWeek = format(new Date(), "RRRR-II");
  const nextYearWeek = format(addWeeks(new Date(), 1), "RRRR-II");

  const targetYearWeek = viewMode === 'upcoming' ? nextYearWeek : currentYearWeek;
  const forNextWeek = viewMode === 'upcoming';

  const { data: weeklyMealPlan, isLoading, isFetching, isError, refetch } = useWeeklyMealPlan(householdId || null, forNextWeek);
  const { data: dashboardInfo } = useHouseholdDashboardInfo(householdId || null);
  const { user } = useAuth();
  const { mutate: updateWeeklyMealPlan } = useUpdateWeeklyMealPlan();

  // Create user map for displaying names in addons
  const userMap = React.useMemo(() => {
    if (!dashboardInfo?.users) return {};
    return dashboardInfo.users.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {} as Record<string, string>);
  }, [dashboardInfo?.users]);

  // Extract meal plan data for helpers
  const realMealPlanData = weeklyMealPlan?.weekly_meal_plan?.meals;
  const realAddonsData = weeklyMealPlan?.weekly_meal_plan?.addons;
  const hasRealMealPlan = !!realMealPlanData && Object.keys(realMealPlanData).length > 0;

  // 3. Logic Hooks
  const { handleReplaceMeal } = useMealReplacement({
    householdId,
    user,
    weeklyMealPlan,
    selectedMealId,
    forNextWeek,
    updateWeeklyMealPlan,
    onSuccess: handleCloseMealDetail
  });

  const { imagesPreloaded, preloadProgress } = useImagePreloading(
    hasRealMealPlan,
    realMealPlanData,
    realAddonsData
  );

  const {
    mutate: generateMealPlan,
    isPending: isGenerating,
    error: generationErrorObj
  } = useGenerateMealPlan();

  const generationError = generationErrorObj ? (generationErrorObj as Error).message : null;

  const { mutate: updateStatus, isPending: isApproving } = useUpdateWorkflowStatus();

  const handleApprovePlan = () => {
    if (!householdId) return;
    updateStatus({
      householdId,
      field: '1_meal_status',
      status: 'approved'
    });
  };

  // 4. Transform Data for UI
  // Get today's meals
  const todayKey = format(new Date(), 'EEEE').toLowerCase();

  // Get today's meals for today's view - use real data if available
  const transformedRealMeals = hasRealMealPlan
    ? transformRealMealPlanToUIFormat(realMealPlanData, realAddonsData, userMap)
    : null;
  const todayDetailedMeals = transformedRealMeals?.[todayKey] || emptyDayMeals;

  const getCurrentDayMeals = () => {
    const dayKey = DAYS_OF_WEEK_KEYS[selectedDay];
    return transformedRealMeals?.[dayKey] || emptyDayMeals;
  };

  // Auto-select first non-empty day ONLY on initial load (one-time)
  // After this, user can freely navigate to any day including empty ones
  useEffect(() => {
    // Skip if already initialized or no data yet
    if (hasInitializedDay.current || !transformedRealMeals) return;

    const currentDayMeals = transformedRealMeals[DAYS_OF_WEEK_KEYS[selectedDay]];

    // Mark as initialized regardless of whether we switch
    hasInitializedDay.current = true;

    // "when someone loads the dashboard show the today tab if the meals are not empty"
    // Only perform this auto-selection if the user hasn't explicitly overridden settings context 
    if (!hasUrlViewParam && !hasUserChangedView && !isDayEmpty(todayDetailedMeals)) {
      setViewMode('today', false);
    }

    // If current day has meals, no need to switch
    if (!isDayEmpty(currentDayMeals)) return;

    // Find first non-empty day
    for (let i = 0; i < DAYS_OF_WEEK_KEYS.length; i++) {
      const dayKey = DAYS_OF_WEEK_KEYS[i];
      const dayMeals = transformedRealMeals[dayKey];
      if (!isDayEmpty(dayMeals)) {
        handleDayChange(i);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformedRealMeals]); // Intentionally only depends on data, runs once on load

  const handleGenerateMealPlan = () => {
    if (!householdId) {
      return;
    }
    generateMealPlan({ householdId, forNextWeek });
  };

  return (
    <div className="bg-white p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <PlannerHeader
          hasRealMealPlan={hasRealMealPlan}
          imagesPreloaded={imagesPreloaded}
          preloadProgress={preloadProgress}
          onApprove={handleApprovePlan}
          isApproving={isApproving}
        />

        <ViewModeToggle
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <WeeklyViewToggle
          view={activeTab}
          onViewChange={setActiveTab}
        />

        {isError ? (
          <PlannerErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <PlannerSkeleton />
        ) : !hasRealMealPlan ? (
          <EmptyMealPlanState
            isGenerating={isGenerating}
            generationError={generationError}
            onGenerate={handleGenerateMealPlan}
          />
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity duration-300" : "transition-opacity duration-300"}>
            {viewMode === 'today' && (
              <>
                {activeTab === 'meals' ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4 px-1">
                      <h2 className="text-[20px] font-montserrat font-bold text-black">
                        {format(new Date(), 'EEEE')}
                      </h2>
                      <span className="text-base text-gray-500 font-medium font-montserrat">
                        {format(new Date(), 'MMM d')}
                      </span>
                    </div>
                    <DailyMealList
                      dayMeals={todayDetailedMeals}
                      onMealClick={handleMealClick}
                      dayType="today"
                    />
                  </>
                ) : (
                  <WeeklyInsights
                    selectedDate={new Date()}
                    insightsData={weeklyMealPlan?.weekly_meal_plan?.daily_insights}
                  />
                )}
              </>
            )}

            {(viewMode === 'weekly' || viewMode === 'upcoming') && (
              <>
                {activeTab === 'meals' ? (
                  <WeeklyPlannerView
                    selectedDay={selectedDay}
                    onDayChange={handleDayChange}
                    startDate={viewMode === 'upcoming' ? nextWeekStart : currentWeekStart}
                    currentDayMeals={getCurrentDayMeals()}
                    onMealClick={handleMealClick}
                  />
                ) : (
                  <>
                    <WeeklyDaySelector
                      selectedDay={selectedDay}
                      onDayChange={handleDayChange}
                      startDate={viewMode === 'upcoming' ? nextWeekStart : currentWeekStart}
                    />
                    <WeeklyInsights
                      selectedDate={addDays(viewMode === 'upcoming' ? nextWeekStart : currentWeekStart, selectedDay)}
                      insightsData={weeklyMealPlan?.weekly_meal_plan?.daily_insights}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <MealDetailModal
        isOpen={isMealDetailOpen}
        mealId={selectedMealId || 'unknown'}
        onClose={handleCloseMealDetail}
        initialImageUrl={selectedMealImage}
        onReplaceMeal={handleReplaceMeal}
        mealPlanData={realMealPlanData}
        addonsData={realAddonsData}
        imagesPreloaded={imagesPreloaded}
      />
    </div>
  );
}