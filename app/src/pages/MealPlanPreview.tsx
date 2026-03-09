import React, { useState, useRef, useEffect } from "react";
import { StepTransition } from "@/components/StepTransition";
import ProgressBar from "@/components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { mealPlanStyles } from "./styles/SharedPageStyles";
import { db, storage } from "@/lib/firebase";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { format } from "date-fns";
import { MealPlanCarousel } from "@/components/mealPlan/MealPlanCarousel";
import { logMealUpdateTransaction } from '@/services/database';
import { useAuth } from "@/hooks/useAuth";
import { useWeeklyMealPlan, useUpdateWeeklyMealPlan } from "@/hooks/useHouseholdData";

export default function MealPlanPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const householdId = user?.household_id;

  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  const prevIndexRef = useRef<number | null>(null);

  const [mealImages, setMealImages] = useLocalStorage<{ [mealId: string]: string }>(
    "mealImages",
    {}
  );
  const [mealImagesThumbnail, setMealImagesThumbnail] = useLocalStorage<{ [mealId: string]: string }>(
    "mealImagesThumbnail",
    {}
  );
  const [mealImagesMedium, setMealImagesMedium] = useLocalStorage<{ [mealId: string]: string }>(
    "mealImagesMedium",
    {}
  );

  const yearWeek = format(new Date(), "RRRR-II");

  // Fetch meal plan using React Query
  const { data: weeklyMealPlan, isLoading } = useWeeklyMealPlan(householdId || null, false);
  const updateMealPlanMutation = useUpdateWeeklyMealPlan();

  // Structure the data to match what MealPlanCarousel expects
  const plan = (weeklyMealPlan as any)?.weekly_meal_plan || (weeklyMealPlan as any);
  const mealPlanDataToUse = {
    meals: plan?.meals || {},
    addons: plan?.addons || {},
    weekly_plan: plan || {},
    meal_details: {},
    sides_details: {}
  };

  if (isLoading || !mealPlanDataToUse.meals || Object.keys(mealPlanDataToUse.meals).length === 0) {
    return (
      <StepTransition>
        <div className={mealPlanStyles.loadingContainer}>
          <div className={mealPlanStyles.header}>
            <h1 className={mealPlanStyles.loadingTitle}>Loading meal plan...</h1>
            <p className={mealPlanStyles.loadingSubtitle}>
              Please wait while we fetch your personalized meal plan
            </p>
          </div>
        </div>
      </StepTransition>
    );
  }

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);

    const today = new Date();
    const currentDayOfWeek = today.getDay();

    let targetDayOfWeek = currentDayOfWeek;
    if (currentDayOfWeek === 0) {
      targetDayOfWeek = 1;
    }

    const todayIndex = targetDayOfWeek === 0 ? 6 : targetDayOfWeek - 1;
    api.scrollTo(todayIndex);
    setCurrent(todayIndex + 1);
    prevIndexRef.current = todayIndex;

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();

      if (prevIndexRef.current !== null) {
        if (prevIndexRef.current === 6 && newIndex === 0) {
          setWeekOffset((prev) => prev + 1);
        }
        if (prevIndexRef.current === 0 && newIndex === 6) {
          setWeekOffset((prev) => prev - 1);
        }
      }

      prevIndexRef.current = newIndex;
      setCurrent(newIndex + 1);
    });
  }, [api]);

  useEffect(() => {
    async function fetchImages() {
      const mealIds = new Set<string>();
      Object.values(mealPlanDataToUse.meals).forEach((dayMeals: any) => {
        if (Array.isArray(dayMeals)) {
          dayMeals.forEach((meal: any) => {
            if (meal.meal_id) mealIds.add(meal.meal_id);
          });
        }
      });

      const idsToFetch = Array.from(mealIds).filter(
        (id) => !mealImages[id] || !mealImagesThumbnail[id] || !mealImagesMedium[id]
      );
      if (idsToFetch.length === 0) return;

      const freshImages: { [mealId: string]: string } = {};
      const freshThumbs: { [mealId: string]: string } = {};
      const freshMedium: { [mealId: string]: string } = {};

      await Promise.all(
        idsToFetch.map(async (mealId) => {
          try {
            const mealDoc = await getDoc(doc(db, "meals", mealId));
            if (mealDoc.exists()) {
              const mealData = mealDoc.data();
              if (mealData.imageUrl) {
                if (mealData.imageUrl.startsWith("http")) {
                  freshImages[mealId] = mealData.imageUrl;
                } else {
                  const url = await getDownloadURL(ref(storage, mealData.imageUrl));
                  freshImages[mealId] = url;
                }
              }

              if (mealData.imageUrlThumbnail) {
                if (mealData.imageUrlThumbnail.startsWith("http")) {
                  freshThumbs[mealId] = mealData.imageUrlThumbnail;
                } else {
                  const urlThumb = await getDownloadURL(ref(storage, mealData.imageUrlThumbnail));
                  freshThumbs[mealId] = urlThumb;
                }
              }

              if (mealData.imageUrlMedium) {
                if (mealData.imageUrlMedium.startsWith("http")) {
                  freshMedium[mealId] = mealData.imageUrlMedium;
                } else {
                  const urlMed = await getDownloadURL(ref(storage, mealData.imageUrlMedium));
                  freshMedium[mealId] = urlMed;
                }
              }
            }
          } catch (e) {
            console.error("Error fetching meal doc for", mealId, e);
          }
        })
      );

      if (Object.keys(freshImages).length > 0) {
        setMealImages((prev) => ({ ...prev, ...freshImages }));
      }
      if (Object.keys(freshThumbs).length > 0) {
        setMealImagesThumbnail((prev) => ({ ...prev, ...freshThumbs }));
      }
      if (Object.keys(freshMedium).length > 0) {
        setMealImagesMedium((prev) => ({ ...prev, ...freshMedium }));
      }
    }

    fetchImages();
  }, [weeklyMealPlan, mealImages, mealImagesThumbnail, mealImagesMedium]);

  const handleAlternateSelect = async (
    dayKey: string,
    mealTime: string,
    selectedMealId: string,
    oldDishId?: string
  ) => {
    if (!householdId || !user) return;

    // Optimistic update or just mutation?
    // For now, let's do mutation and invalidate.
    // But wait, the mutation expects the WHOLE plan.
    // We need to modify the plan locally first.

    const updatedMealPlan = JSON.parse(JSON.stringify(weeklyMealPlan)); // Deep copy
    const meal = updatedMealPlan?.meals?.[dayKey]?.[mealTime] ||
      updatedMealPlan?.weekly_meal_plan?.weekly_plan?.[dayKey]?.[mealTime] ||
      updatedMealPlan?.weekly_plan?.[dayKey]?.[mealTime];

    if (!meal || !oldDishId) return;

    type Field = "meal_id" | "sides";
    const fields: Field[] = ["meal_id", "sides"];
    let replacedField: Field | null = null;

    fields.forEach((field) => {
      const list = meal[field] as string[] | undefined;
      if (Array.isArray(list) && list.includes(oldDishId)) {
        meal[field] = [selectedMealId];
        replacedField = field;
      }
    });

    if (!replacedField) return;

    // Call mutation to save
    updateMealPlanMutation.mutate({
      householdId,
      forNextWeek: false,
      plan: updatedMealPlan,
      userId: user.user_id || ""
    });

    try {
      await logMealUpdateTransaction(
        householdId,
        yearWeek,
        dayKey,
        mealTime,
        oldDishId,
        selectedMealId,
        user?.user_id ?? ""
      );
    } catch (e) {
      console.error("Failed to log meal update transaction", e);
    }
  };

  const handleApprovePlan = async () => {
    // Just navigate, data is already saved/fetched
    navigate("/grocery-list");
  };

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <StepTransition>
      <div className={mealPlanStyles.container}>
        <ProgressBar step={1} total={4} />

        <div className={mealPlanStyles.header}>
          <h1 className={mealPlanStyles.title}>Weekly Plan Review</h1>
          <p className={mealPlanStyles.subtitle}>
            WEEK OF JAN 5-12
          </p>
        </div>


        <div className={mealPlanStyles.mainContent}>
          <MealPlanCarousel
            mealPlanData={mealPlanDataToUse}
            mealImages={mealImages}
            mealImagesThumbnail={mealImagesThumbnail}
            mealImagesMedium={mealImagesMedium}
            current={current}
            scrollTo={scrollTo}
            setApi={setApi}
            onSelectAlternate={handleAlternateSelect}
            weekOffset={weekOffset}
          />
        </div>

      </div>

      <div className={mealPlanStyles.footer}>
        <div className={mealPlanStyles.actionButtonsContainer}>
          <button
            className={mealPlanStyles.backButton}
            onClick={() => navigate(`/dashboard/${householdId}`)}
          >
            &larr; Back
          </button>
          <button
            className={mealPlanStyles.button}
            onClick={handleApprovePlan}
          >
            Approve Meal Plan &rarr;
          </button>
        </div>
      </div>
    </StepTransition>
  );
}
