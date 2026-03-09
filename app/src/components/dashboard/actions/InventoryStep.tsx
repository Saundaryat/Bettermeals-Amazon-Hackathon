import React, { useState } from 'react';
import { Package, CheckCircle, Circle } from 'lucide-react';
import { usePantryLogic } from '../inventory/pantry/hooks/usePantryLogic';
import { usePantryFiltering } from '../inventory/pantry/hooks/usePantryFiltering';
import PantryCategoryFilters from '../inventory/pantry/components/PantryCategoryFilters';
import '../inventory/pantry/pantry.css';

interface InventoryStepProps {
    householdId: string;
    onInventoryUpdated?: () => void;
    onSelectionChange?: (count: number, saveCallback: () => void) => void;
}

export default function InventoryStep({ householdId, onInventoryUpdated, onSelectionChange }: InventoryStepProps) {
    const {
        staples,
        perishables,
        toggleInventoryItem,
        hasItem,
        handleFinishOnboarding,
        newlySelectedCount,
        isUpdating
    } = usePantryLogic(householdId);

    const {
        categories,
        selectedCategory,
        setSelectedCategory,
        filteredStaples,
        filteredPerishables
    } = usePantryFiltering(staples, perishables);

    // Combine staples and perishables for display
    const allItems = [...filteredStaples, ...filteredPerishables];

    const handleSaveInventory = () => {
        handleFinishOnboarding(() => {
            if (onInventoryUpdated) {
                onInventoryUpdated();
            }
        });
    };

    // Notify parent of selection changes
    React.useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(newlySelectedCount, handleSaveInventory);
        }
    }, [newlySelectedCount]);

    return (
        <div className="relative min-h-0 pb-12">
            <>
                {/* Category Filters */}
                <PantryCategoryFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {/* Visual Catalog Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4 mt-6">
                    {allItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => toggleInventoryItem(item.id)}
                            className={`relative group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${hasItem(item.id) ? 'border-[#51754f] bg-[#51754f]/10 ring-1 ring-[#51754f]/20' : 'border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200'}`}
                        >
                            <div className="aspect-square w-full overflow-hidden bg-gray-50">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </div>
                                )}
                            </div>
                            <div className="p-2 sm:p-3">
                                <p className={`text-[10px] sm:text-xs font-bold leading-none truncate ${hasItem(item.id) ? 'text-[#51754f]' : 'text-gray-700'}`}>
                                    {item.name}
                                </p>
                            </div>
                            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
                                {hasItem(item.id) ? (
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white bg-[#51754f] rounded-full transition-all scale-110 shadow-sm" />
                                ) : (
                                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 bg-white/90 rounded-full transition-opacity group-hover:text-gray-400" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        </div>
    );
}
