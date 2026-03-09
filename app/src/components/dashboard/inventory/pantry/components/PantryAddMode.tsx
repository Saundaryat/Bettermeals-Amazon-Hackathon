import React from 'react';
import PantrySection from '../PantrySection';
import PantryCategoryFilters from './PantryCategoryFilters';
import { GroceryItem } from '@/components/dashboard/groceries/model/groceries.types';
import { CategoryFilter } from '../hooks/usePantryFiltering';
import '../pantry.css';

interface PantryAddModeProps {
    categories: CategoryFilter[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    filteredStaples: GroceryItem[];
    filteredPerishables: GroceryItem[];
    hasItem: (itemId: string) => boolean;
    onToggle: (itemId: string) => void;
    onFinish: () => void;
    isUpdating: boolean;
    selectedCount: number;
}

export default function PantryAddMode({
    categories,
    selectedCategory,
    onSelectCategory,
    filteredStaples,
    filteredPerishables,
    hasItem,
    onToggle,
    onFinish,
    isUpdating,
    selectedCount
}: PantryAddModeProps) {
    return (
        <>
            <div className="pantry-main-header">
                {selectedCount > 0 && (
                    <button
                        onClick={onFinish}
                        disabled={isUpdating}
                        className="pantry-update-btn"
                    >
                        {isUpdating ? 'Saving...' : `Add items to Inventory (${selectedCount})`}
                    </button>
                )}
            </div>

            <PantryCategoryFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
            />

            <div className="pantry-sections-container">
                {filteredStaples.length > 0 && (
                    <PantrySection
                        title="Staples"
                        description="Non-perishable items that you might already have in your pantry."
                        items={filteredStaples}
                        hasItem={hasItem}
                        onToggle={onToggle}
                    />
                )}

                {filteredPerishables.length > 0 && (
                    <PantrySection
                        title="Perishables"
                        description="Fresh items that you might still have from previous orders."
                        items={filteredPerishables}
                        hasItem={hasItem}
                        onToggle={onToggle}
                    />
                )}
            </div>
        </>
    );
}
