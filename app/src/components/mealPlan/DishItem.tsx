import React, { useState } from "react";
import { mealPlanStyles } from "@/pages/styles/SharedPageStyles";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DishDetails from "./DishDetails";
import AlternateMealsList from "./AlternateMealsList";
import MealDetailModal from "@/components/dashboard/meal_modal/MealDetailModal";

interface Macros {
  fiber?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

interface DishItemProps {
  dish: {
    meal_id: string;
    dish_name: string;
    meal_type?: string;
    pre_process?: string;
    nutrition?: string;
    recipe?: string;
    why?: string;
    macros?: Macros;
    tag?: string[];
    notes?: string;
    ingredients?: string;
    household_members?: string[];
    media?: {
      image_url?: string;
      image_url_thumbnail?: string;
      image_url_medium?: string;
      video?: string;
    };
  };
  description: string;
  quantity: string;
  variants?: any;
  alternates?: any[];
  onSelectAlternate?: (selectedId: string, oldDishId: string) => void;
}

export const DishItem: React.FC<DishItemProps> = ({
  dish,
  description,
  quantity,
  variants,
  alternates = [],
  onSelectAlternate,
}) => {
  console.log('DishItem: Received dish data:', dish);
  console.log('DishItem: dish.meal_id:', dish.meal_id);
  console.log('DishItem: dish.media:', dish.media);
  // (renderMacros logic moved into DishDetails component)

  // Functional goal tags mapping
  const functionalGoalTags = {
    "anti_inflammatory": "Anti-Inflammatory",
    "gut_health_focused": "Gut Health",
    "brain_health_supportive": "Brain Support",
    "brain_health_focused": "Brain Support",
    "mitochondrial_supportive": "Mitochondria Boost",
    "sleep_supportive": "Sleep Support",
    "skin_health_focused": "Skin Health",
    "hormonal_balance_supportive": "Hormone Balance",
    "hormone_support": "Hormone Balance",
    "muscle_maintenance": "Muscle Support",
    "longevity_focused": "Longevity",
    "blood_sugar_stable": "Blood Sugar Stable",
    "insulin_sensitivity_supportive": "Insulin Friendly",
    "energy_optimised": "Energy Boost",
    "immune_supportive": "Immunity Boost",

    // New tags from our data
    "energy-boosting": "Energy Boost",
    "gut-health": "Gut Health",
    "anti-inflammatory": "Anti-Inflammatory",
    "heart-healthy": "Heart Healthy",
    "immune-boosting": "Immunity Boost",
    "digestive-health": "Digestive Health",
    "detox-support": "Detox Support",
    "muscle-recovery": "Muscle Recovery",
    "satisfaction": "Satisfaction",
    "relaxation": "Relaxation",
    "sleep-supportive": "Sleep Support",

    // Macro tags
    "high-protein": "High Protein",
    "high-fiber": "High Fiber",
    "balanced-macros": "Balanced Macros",
    "low-calorie": "Low Calorie",

    // Micronutrient tags
    "iron": "Iron Rich",
    "folate": "Folate Rich",
    "vitamin-c": "Vitamin C",
    "magnesium": "Magnesium Rich",
    "antioxidants": "Antioxidants",
    "vitamin-k": "Vitamin K",

    // Diet/Lifestyle tags
    "vegetarian": "Vegetarian",
    "vegan": "Vegan",
    "gluten-free": "Gluten Free",
    "raw": "Raw",
    "keto": "Keto",
    "paleo": "Paleo"
  };

  // State to control alternate meals visibility
  const [showAlternates, setShowAlternates] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMealDetailOpen, setIsMealDetailOpen] = useState(false);
  const [currentMealId, setCurrentMealId] = useState<string>('');

  const handleSelect = (selectedId: string) => {
    onSelectAlternate?.(selectedId, dish.meal_id);
    setIsOpen(false);
  };

  const handleMealDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mealId = dish.meal_id || dish.meal_id || `dish_${dish.dish_name?.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
    console.log('DishItem: Opening meal detail for mealId:', mealId);
    setCurrentMealId(mealId);
    setIsMealDetailOpen(true);
  };

  const handleCloseMealDetail = () => {
    setIsMealDetailOpen(false);
  };

  // Reset alternates view when modal is closed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShowAlternates(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        {/* The card acts as the trigger */}
        <DialogTrigger asChild>
          <div className={`${mealPlanStyles.dishContainer} cursor-pointer`}>
            <div className="relative">
              <img
                src={dish.media?.image_url_thumbnail || dish.media?.image_url || "/images/dish-placeholder.png"}
                alt={dish.dish_name}
                className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-full border-black/5 flex-shrink-0"
              // loading="lazy"
              />
              <button
                onClick={handleMealDetailClick}
                className="absolute top-0 right-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
                title="View meal details"
              >
                ℹ
              </button>
            </div>
            <div className={mealPlanStyles.dishContent}>
              <span className="font-serif text-black text-sm lg:text-base leading-tight break-words line-clamp-2">
                {dish.dish_name.length > 30 ? `${dish.dish_name.substring(0, 30)}...` : dish.dish_name}
              </span>
              {dish.household_members && dish.household_members.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">For: </span>
                  {dish.household_members.map((member, index) => (
                    <span key={index}>
                      {member === "both" ? "Both" : member === "person1" ? "Person 1" : member === "person2" ? "Person 2" : member}
                      {index < dish.household_members.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              )}
              {dish.tag && dish.tag.length > 0 && (
                <div className={mealPlanStyles.tagsContainer}>
                  {dish.tag.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className={mealPlanStyles.tag}
                    >
                      {functionalGoalTags[tag as keyof typeof functionalGoalTags] || tag}
                    </span>
                  ))}
                </div>
              )}
              {/* <span className={mealPlanStyles.dishQuantity}>{description}</span> */}
            </div>
          </div>
        </DialogTrigger>

        {/* Modal content */}
        <DialogContent className={mealPlanStyles.modalContent}>
          <DialogHeader>
            <DialogTitle className={mealPlanStyles.modalTitle}>{dish.dish_name}</DialogTitle>
            {dish.meal_type && (
              <DialogDescription className="capitalize mt-1 text-muted-foreground">
                {dish.meal_type}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-4"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            {showAlternates ? (
              <AlternateMealsList alternates={alternates} onSelect={handleSelect} />
            ) : (
              <>
                <DishDetails dish={dish} imageUrl={dish.media?.image_url_medium || dish.media?.image_url_thumbnail || dish.media?.image_url || "/images/dish-placeholder.png"} />
                {variants?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold bold text-sm text-muted-foreground">Select available variants</h4>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onSelectAlternate?.(variant.meal_id, dish.meal_id);
                          }}
                          className="text-xs"
                        >
                          {variant.dish_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {alternates.length > 0 && (
                  <Button
                    className={mealPlanStyles.alternateButton}
                    onClick={() => setShowAlternates(true)}
                  >
                    Select alternate meal
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Meal Detail Modal */}
      <MealDetailModal
        isOpen={isMealDetailOpen}
        mealId={currentMealId}
        onClose={handleCloseMealDetail}
      />
    </>
  );
}; 