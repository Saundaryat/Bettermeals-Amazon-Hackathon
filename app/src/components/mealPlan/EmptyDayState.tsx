import React from "react";
import { mealPlanStyles } from "@/pages/styles/SharedPageStyles";

export const EmptyDayState: React.FC = () => {
  return (
    <div className={mealPlanStyles.dayContent}>
      <div className={mealPlanStyles.emptyState}>
        <p className={mealPlanStyles.emptyStateText}>
          No meal plan available for this day
        </p>
      </div>
    </div>
  );
}; 