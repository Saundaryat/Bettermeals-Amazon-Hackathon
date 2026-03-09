import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useInventoryList, useUpdateInventory } from "../../../hooks/useHouseholdData";
import { GroceryCategory, GroceryItem } from '../groceries/model/groceries.types';
import { transformApiDataToCategories } from '../groceries/utils/groceries.utils';
import GroceriesLoading from '../groceries/feedback/GroceriesLoading';
import GroceriesError from '../groceries/feedback/GroceriesError';
import CategoryFilter from '../groceries/ui/CategoryFilter';
import InventoryCategory from './InventoryCategory';

interface InventoryViewProps {
  householdId?: string | null;
}

export default function InventoryView({ householdId }: InventoryViewProps) {
  const {
    data: inventoryList,
    isLoading: inventoryListLoading,
    error: inventoryListErrorObj
  } = useInventoryList(householdId || null);

  const inventoryListError = inventoryListErrorObj ? (inventoryListErrorObj as Error).message : null;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inventoryItems, setInventoryItems] = useState<Set<string>>(new Set());

  const toggleInventoryItem = (itemId: string) => {
    setInventoryItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const hasItem = (itemId: string) => inventoryItems.has(itemId);

  /**
   * Retrieves and transforms the inventory list data from the API response.
   */
  const getInventoryCategories = (): GroceryCategory[] => {
    // Check for the nested inventory structure from the API
    // The structure is: response.inventory.inventory = { [id]: item, ... }
    if (inventoryList?.inventory?.inventory) {
      const inventoryMap = inventoryList.inventory.inventory;
      const inventoryArray = Object.values(inventoryMap).map((item: any) => ({
        ...item,
        category: item.details?.category || item.category,
      }));
      return transformApiDataToCategories(inventoryArray);
    }

    return [];
  };

  const inventoryCategories = getInventoryCategories();

  const safeCategories = Array.isArray(inventoryCategories)
    ? inventoryCategories.map((category: GroceryCategory) => ({
      ...category,
      items: Array.isArray(category.items) ? category.items : []
    }))
    : [];

  const filteredCategories = selectedCategory === 'all'
    ? safeCategories
    : safeCategories.filter((category: GroceryCategory) =>
      category.name.toLowerCase() === selectedCategory.toLowerCase()
    );

  // Initialize items as checked when inventory list changes
  useEffect(() => {
    const checkedItemIds = new Set<string>();

    let inventoryItems: any[] = [];

    if (inventoryList?.inventory?.inventory) {
      inventoryItems = Object.values(inventoryList.inventory.inventory);
    }

    if (inventoryItems.length > 0) {
      inventoryItems.forEach((item: any) => {
        const itemId = item.prd_id || `item - ${Math.random()} `;
        // For inventory, we might want to default everything to checked or based on some property
        // Assuming all items returned in inventory are "in inventory"
        checkedItemIds.add(itemId);
      });
    }

    setInventoryItems(checkedItemIds);
  }, [inventoryList]);

  const { mutate: updateInventory, isPending: isUpdating } = useUpdateInventory();

  const handleUpdateInventory = () => {
    if (!householdId) return;

    let currentInventory: any[] = [];
    if (inventoryList?.inventory?.inventory) {
      currentInventory = Object.values(inventoryList.inventory.inventory);
    }

    const updatedInventoryList = currentInventory.filter(item => {
      const itemId = item.prd_id || item.id; // Ensure we have an ID to check against

      // So we filter items whose ID is in 'inventoryItems'.
      return inventoryItems.has(itemId);
    });

    updateInventory({ householdId, inventoryList: updatedInventoryList }, {
      onSuccess: () => {
        // Optional: Show success message
        console.log("Inventory updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update inventory", error);
      }
    });
  };

  if (inventoryListLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (inventoryListError) {
    return <GroceriesError message={inventoryListError} />;
  }

  return (
    <div className="groceries-container lg:pb-6">
      <div className="groceries-content">
        <CategoryFilter
          categories={safeCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredCategories.length === 0 ? (
          <div className="groceries-empty-state">
            <ShoppingBag className="groceries-empty-icon" />
            <p className="groceries-empty-text">Your inventory is empty</p>
            <p className="groceries-empty-subtext">
              Items you add to your inventory will appear here
            </p>
          </div>
        ) : (
          <div className="groceries-grid">
            {filteredCategories.map((category: GroceryCategory) => (
              <InventoryCategory
                key={category.name}
                category={category}
                hasItem={hasItem}
                onToggleItem={toggleInventoryItem}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleUpdateInventory}
            disabled={isUpdating}
            className="grocery-actions-btn"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black/30"></div>
                Updating...
              </>
            ) : (
              "Update Inventory"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
