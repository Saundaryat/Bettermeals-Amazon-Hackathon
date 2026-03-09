import { useState, useEffect, useMemo } from 'react';
import { useGroceryList, useInventoryList, useUpdateInventory } from '@/hooks/useHouseholdData';
import { GroceryItem } from '../../../groceries/model/groceries.types';
import pantryData from '../pantry_data/pantry.json';

const getMergedStaples = (): GroceryItem[] => {
    return Object.values(pantryData).map((item: any) => {
        // Determine effective ID
        const effectiveId = item.id || (item.ing_id && item.ing_id.length > 0 ? item.ing_id[0] : item.name);

        const quantity = item.min_order_specs?.qty || item.qty || 1;
        const unit = item.min_order_specs?.unit || item.unit || 'each';

        return {
            ...item,
            id: effectiveId,
            prd_id: effectiveId,
            media: item.media || { image_url: '' },
            image_url: item.media?.image_url || '',
            // crucial: map snake_case to camelCase for the UI
            isStaple: item.is_staple,
            quantity: quantity,
            unit: unit,
            order_specs: {
                unit: unit,
                required_qty: quantity,
                ordered_qty: quantity,
                min_order_specs: {
                    unit: unit,
                    qty: quantity
                }
            },
            notes: '',
            checked: false
        } as GroceryItem;
    });
};

export const usePantryLogic = (householdId?: string) => {
    const { data: inventoryList, isLoading: isInventoryLoading, error: inventoryError } = useInventoryList(householdId || null);
    const { mutate: updateInventory, isPending: isUpdating } = useUpdateInventory();

    const [inventoryItems, setInventoryItems] = useState<Set<string>>(new Set());
    const [initialInventoryItems, setInitialInventoryItems] = useState<Set<string>>(new Set());
    const [staples, setStaples] = useState<GroceryItem[]>([]);
    const [perishables, setPerishables] = useState<GroceryItem[]>([]);

    const allStaples = useMemo(() => getMergedStaples(), []);

    // Initialize inventory from fetched data
    useEffect(() => {
        if (inventoryList?.inventory?.inventory) {
            const loadedInventoryIds = new Set<string>();
            Object.values(inventoryList.inventory.inventory).forEach((item: any) => {
                if (item.prd_id) loadedInventoryIds.add(item.prd_id);
                if (item.id) loadedInventoryIds.add(item.id);
            });
            setInventoryItems(loadedInventoryIds);
            setInitialInventoryItems(loadedInventoryIds);
        }
    }, [inventoryList]);

    useEffect(() => {
        // Show ALL items (both in inventory and not in inventory)
        // The selection state is already handled by inventoryItems Set
        // This allows users to see their current inventory when navigating back

        // Show all non-perishables as staples for the inventory list
        const currentStaples = allStaples.filter(item => !item.perishable);
        const currentPerishables = allStaples.filter(item => item.perishable);

        setStaples(currentStaples);
        setPerishables(currentPerishables);
    }, [inventoryList, allStaples]);

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

    const saveInventory = (onSuccess?: () => void) => {
        if (!householdId) return;

        // Construct the inventory list to save
        const selectedItems: any[] = [];

        // 1. Check Default Staples (now allStaples)
        allStaples.forEach(item => {
            if (inventoryItems.has(item.id)) {
                selectedItems.push({
                    ...item,
                    prd_id: item.prd_id || item.id,
                    is_staple: true, // Ensure snake_case for backend
                    perishable: false,
                    // Ensure these exist if they are missing in source
                    order_specs: item.order_specs || {},
                    details: item.details || {}
                });
            }
        });

        // 2. Preserve existing inventory items that might not be in the current view lists
        if (inventoryList?.inventory?.inventory) {
            Object.values(inventoryList.inventory.inventory).forEach((item: any) => {
                const itemId = item.prd_id || item.id;
                // If the item is in our "checked" set (inventoryItems), we want to keep it.
                // If it's NOT in the set, it means the user unchecked it, so we DON'T add it (effectively deleting it).
                // However, we only "uncheck" items that are visible in the UI. 
                // If an item is NOT in staples/perishables/allStaples, the user couldn't have unchecked it.
                // So we should preserve it if it's not in the visible lists.

                const isVisibleInUI = allStaples.some(i => i.id === itemId);

                if (!isVisibleInUI) {
                    // Keep it if it was already in inventory and not visible to be unchecked
                    if (!selectedItems.find(i => (i.prd_id === itemId || i.id === itemId))) {
                        selectedItems.push(item);
                    }
                } else if (inventoryItems.has(itemId) && !selectedItems.find(i => (i.prd_id === itemId || i.id === itemId))) {
                    // It IS visible, IS checked, but hasn't been added yet (maybe logic above missed it?)
                    selectedItems.push(item);
                }
            });
        }

        updateInventory({ householdId, inventoryList: selectedItems }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
            onError: (error) => {
                console.error("Failed to update inventory", error);
            }
        });
    };

    const handleFinishOnboarding = (onSuccess?: () => void) => {
        saveInventory(onSuccess);
    };

    // Calculate newly selected items count
    // It is the count of items in inventoryItems that are NOT in initialInventoryItems
    const newlySelectedCount = Array.from(inventoryItems).filter(id => !initialInventoryItems.has(id)).length;

    return {
        inventoryList,
        isInventoryLoading,
        inventoryError,
        isUpdating,
        inventoryItems,
        staples,
        perishables,
        toggleInventoryItem,
        hasItem,
        handleFinishOnboarding,
        newlySelectedCount
    };
};
