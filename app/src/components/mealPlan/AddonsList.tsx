import React from "react";
import { User } from "lucide-react";
import { mealPlanStyles } from "@/pages/styles/SharedPageStyles";
import { Addon } from "@/services/types";

interface AddonsListProps {
  perUserAddons: { [user: string]: string | Addon } | undefined;
}

export const AddonsList: React.FC<AddonsListProps> = ({ perUserAddons }) => {
  const filteredAddons = Object.entries(perUserAddons || {})
    .filter(([_, addon]) => {
      if (typeof addon === "string") return !!addon;
      if (typeof addon === "object" && addon !== null) {
        return !!(addon as Addon).addon_name;
      }
      return false;
    });

  const hasNoAddons = Object.values(perUserAddons || {}).every((v) => {
    if (typeof v === "string") return !v;
    if (typeof v === "object" && v !== null) return !(v as Addon).addon_name;
    return true;
  });

  return (
    <div className={mealPlanStyles.addonsContainer}>
      <div className={mealPlanStyles.addonsTitle}>
        Personal Add-ons:
      </div>
      <div className={mealPlanStyles.addonsList}>
        {filteredAddons.map(([user, addon]) => (
          <div key={user} className={mealPlanStyles.addonItem}>
            <User size={14} className={mealPlanStyles.addonIcon} />
            <div className={mealPlanStyles.addonContent}>
              <span className={mealPlanStyles.addonUserName}>{user}:</span>
              <span className={mealPlanStyles.addonText}>
                {typeof addon === "object" && addon !== null
                  ? (addon as Addon).addon_name
                  : (addon as string)}
              </span>
            </div>
          </div>
        ))}
        {/* If no add-ons: */}
        {hasNoAddons && (
          <span className={mealPlanStyles.noAddonsText}>None</span>
        )}
      </div>
    </div>
  );
}; 