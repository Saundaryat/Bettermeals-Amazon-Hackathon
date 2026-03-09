import React, { useState } from 'react';
import { GroceryItem } from '../../groceries/model/groceries.types';
import InventoryView from '../InventoryView';
import './pantry.css';
import { usePantryFiltering } from './hooks/usePantryFiltering';
import PantryHeaderTabs, { PantryActiveView } from './components/PantryHeaderTabs';
import PantryAddMode from './components/PantryAddMode';

interface PantryOnboardingProps {
    staples: GroceryItem[];
    perishables: GroceryItem[];
    hasItem: (itemId: string) => boolean;
    onToggle: (itemId: string) => void;
    onFinish: () => void;
    isUpdating: boolean;
    selectedCount: number;
    householdId?: string | null;
}

export type { PantryActiveView };

export default function PantryOnboarding({
    staples,
    perishables,
    hasItem,
    onToggle,
    onFinish,
    isUpdating,
    selectedCount,
    householdId
}: PantryOnboardingProps) {
    const [viewMode, setViewMode] = useState<PantryActiveView>('add');
    const {
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredStaples,
        filteredPerishables
    } = usePantryFiltering(staples, perishables);

    return (
        <div className="bg-white p-4 lg:p-6 pb-24">
            <div className="pantry-container">

                {/* Header */}
                <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">
                            My Pantry
                        </h1>
                        <div className="flex items-center gap-3 text-black/70 text-sm lg:text-base">
                            <p>Manage your kitchen inventory.</p>
                        </div>
                    </div>
                </div>

                <PantryHeaderTabs
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                <div className="groceries-header-desc-container">
                    <p className="groceries-header-desc">
                        {viewMode === 'add'
                            ? "Mark items you already have in your kitchen."
                            : "Items you already have."}
                    </p>
                </div>

                {viewMode === 'add' ? (
                    <PantryAddMode
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        filteredStaples={filteredStaples}
                        filteredPerishables={filteredPerishables}
                        hasItem={hasItem}
                        onToggle={onToggle}
                        onFinish={onFinish}
                        isUpdating={isUpdating}
                        selectedCount={selectedCount}
                    />
                ) : (
                    <InventoryView householdId={householdId} />
                )}
            </div>
        </div>
    );
}
