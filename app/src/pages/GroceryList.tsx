import React, { useState, useEffect } from "react";
import { StepTransition } from "@/components/StepTransition";
import ProgressBar from "@/components/ProgressBar";
import { Sprout, Utensils, Candy, Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { groceryListStyles } from "./styles/SharedPageStyles";
import { useAuth } from "@/hooks/useAuth";
import { useGroceryList } from "@/hooks/useHouseholdData";
import { GroceryItem } from "@/services/types";

// Dynamic icon mapping based on category names
const getAisleIcon = (category: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "vegetables": <Sprout className="text-leafgreen-500" />,
    "spices": <Package className="text-peach-400" />,
    "grains": <Package className="text-yellow-600" />,
    "dairy": <ShoppingCart className="text-leafgreen-700" />,
    "legumes": <Package className="text-orange-500" />,
    "fruits": <Sprout className="text-red-400" />,
    "nuts": <Package className="text-amber-600" />,
    "seeds": <Package className="text-green-600" />,
    "oils": <Package className="text-yellow-500" />,
    "meat": <Utensils className="text-red-500" />,
    "eggs": <ShoppingCart className="text-yellow-700" />,
    "protein": <Utensils className="text-red-500" />,
    "sweeteners": <Candy className="text-pink-500" />,
    "liquids": <Package className="text-blue-500" />,
    "condiments": <Package className="text-purple-500" />,
    "unknown": <Utensils className="text-gray-400" />,
  };

  return iconMap[category] || <Utensils className="text-gray-400" />;
};

// Convert category to display name
const getCategoryDisplayName = (category: string) => {
  const displayMap: { [key: string]: string } = {
    "vegetables": "Vegetables",
    "spices": "Spices",
    "grains": "Grains",
    "dairy": "Dairy",
    "legumes": "Legumes",
    "fruits": "Fruits",
    "nuts": "Nuts",
    "seeds": "Seeds",
    "oils": "Oils",
    "meat": "Meat",
    "eggs": "Eggs",
    "protein": "Protein",
    "sweeteners": "Sweeteners",
    "liquids": "Liquids",
    "condiments": "Condiments",
    "unknown": "Other",
  };

  return displayMap[category] || "Other";
};


export default function GroceryList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const householdId = user?.household_id;

  const { data: groceryListData, isLoading } = useGroceryList(householdId || null);

  // Extract grocery_list from the grocery list data
  const groceryItems = groceryListData?.grocery_plan?.weekly_grocery_plan?.grocery_list || [];

  // Initialize items with checked state
  const [items, setItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    if (groceryItems.length > 0) {
      setItems(groceryItems.map((item) => ({
        ...item,
        checked: true // Start with all items checked (included)
      })));
    }
  }, [groceryItems]);

  function handleGroceryApproval() {
    // const checked = items.filter(item => item.checked)
    // updateGroceryList(groceryList.id, checked)
    navigate("/plan-approval")
  }

  // Check if we have valid grocery list data
  if (isLoading) {
    return (
      <StepTransition>
        <div className={groceryListStyles.loadingContainer}>
          <ProgressBar step={2} total={4} />
          <div className={groceryListStyles.header}>
            <h1 className={groceryListStyles.loadingTitle}>Loading grocery list...</h1>
            <p className={groceryListStyles.loadingSubtitle}>
              Please wait while we fetch your grocery list
            </p>
          </div>
        </div>
      </StepTransition>
    );
  }

  if (!groceryItems || groceryItems.length === 0) {
    return (
      <StepTransition>
        <div className={groceryListStyles.loadingContainer}>
          <ProgressBar step={2} total={4} />
          <div className={groceryListStyles.header}>
            <h1 className={groceryListStyles.loadingTitle}>No grocery list found.</h1>
            <p className={groceryListStyles.loadingSubtitle}>
              Please generate a meal plan first.
            </p>
          </div>
        </div>
      </StepTransition>
    );
  }

  function handleCheck(itemName: string) {
    setItems(prevItems =>
      prevItems.map(item =>
        item.name === itemName
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }

  // Get unique categories from the data
  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  // Group items by category
  const grouped = uniqueCategories.map(category => ({
    name: getCategoryDisplayName(category),
    icon: getAisleIcon(category),
    items: items.filter(item => item.category === category),
  }));

  // Calculate estimated cost (since we don't have prices in the new structure, we'll show item count)
  const checkedItems = items.filter(item => item.checked);
  const totalItems = checkedItems.length;

  return (
    <StepTransition>
      <div className={groceryListStyles.container}>
        <ProgressBar step={2} total={4} />

        {/* Header Section */}
        <div className={groceryListStyles.header}>
          <h1 className={groceryListStyles.title}>One list. One Order.</h1>
          <p className={groceryListStyles.subtitle}>
            Uncheck items you already have in your pantry — they'll be removed from your order
          </p>
        </div>

        {/* Main Content */}
        <div className={groceryListStyles.mainContent}>
          {/* Mobile-First Grid Layout */}
          <div className={groceryListStyles.gridContainer}>
            {grouped.map(group => (
              <div
                key={group.name}
                className={groceryListStyles.aisleGroup}
                style={groceryListStyles.aisleGroupMinHeight}
              >
                {/* Category Header */}
                <div className={groceryListStyles.aisleHeader}>
                  <span className={groceryListStyles.aisleIcon}>{group.icon}</span> {group.name}
                </div>

                {/* Item List */}
                <ul className={groceryListStyles.itemList}>
                  {group.items.length === 0 && (
                    <li className={groceryListStyles.emptyItem}>None</li>
                  )}
                  {group.items.map(item => (
                    <li
                      key={item.name}
                      className={groceryListStyles.itemContainer(item.checked)}
                    >
                      {/* Item Content */}
                      <div className={groceryListStyles.itemContent}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleCheck(item.name)}
                          className={groceryListStyles.checkbox}
                          id={`check-${item.name}`}
                        />
                        <label
                          htmlFor={`check-${item.name}`}
                          className={groceryListStyles.itemLabel(item.checked)}
                        >
                          {item.name}
                          {item.is_staple && <span className="text-xs text-gray-500 ml-1">(staple)</span>}
                          {item.optional && <span className="text-xs text-blue-500 ml-1">(optional)</span>}
                        </label>
                      </div>

                      {/* Item Details */}
                      <div className={groceryListStyles.itemDetails}>
                        <span className={groceryListStyles.itemQuantity}>
                          {item.order_specs.min_order_specs.qty} {item.order_specs.min_order_specs.unit}
                          {item.perishable && (
                            <span className="text-xs text-orange-500 ml-1">• Perishable</span>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-Optimized Footer */}
        <div className={groceryListStyles.footer}>
          {/* Item Count Display */}
          <span className={groceryListStyles.costDisplay}>
            Total items: <span className={groceryListStyles.costAmount}>{totalItems}</span>
          </span>

          {/* Action Buttons */}
          <div className={groceryListStyles.actionButtonsContainer}>
            <button
              className={groceryListStyles.backButton}
              onClick={() => navigate("/meal-plan")}
            >
              &larr; Back
            </button>
            <button
              className={groceryListStyles.button}
              onClick={handleGroceryApproval}
            >
              Approve Grocery List &rarr;
            </button>

          </div>
        </div>
      </div>
    </StepTransition>
  );
}


