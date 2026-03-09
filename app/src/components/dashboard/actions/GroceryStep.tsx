import React from 'react';
import GroceriesHeader from '../groceries/ui/GroceriesHeader';

import PeriodSelector from '../groceries/ui/PeriodSelector';
import GroceriesLoading from '../groceries/feedback/GroceriesLoading';
import GroceriesError from '../groceries/feedback/GroceriesError';
import GroceryEmptyState from '../groceries/views/GroceryEmptyState';
import GroceryConfirmed from '../groceries/views/GroceryConfirmed';
import GroceryListExpanded from '../groceries/ui/GroceryListExpanded';
import { useGroceriesViewModel } from '../groceries/hooks/useGroceriesViewModel';
import { Info } from 'lucide-react';
import '../groceries/styles/groceries.css';

interface GroceryStepProps {
    householdId?: string;
    forNextWeek?: boolean;
}

export default function GroceryStep({ householdId, forNextWeek }: GroceryStepProps) {
    const {
        groceryListLoading,
        groceryListError,
        hasGeneratedList,
        filteredCategories,
        safeCategories,
        availablePeriods,
        activePeriod,
        selectedCategory,
        isGenerating,
        generationError,
        isCurrentPeriodConfirmed,
        setActivePeriod,
        setSelectedCategory,
        toggleItemChecked,
        isItemChecked,
        handleGenerateGroceryList,
    } = useGroceriesViewModel(householdId, forNextWeek);

    if (groceryListLoading) {
        return <GroceriesLoading />;
    }

    if (groceryListError) {
        return <GroceriesError message={groceryListError} />;
    }

    return (
        <div className="groceries-page !p-0">
            <div className="groceries-container !p-0">
                <GroceriesHeader />

                {hasGeneratedList && (
                    <PeriodSelector
                        activePeriod={activePeriod}
                        availablePeriods={availablePeriods}
                        onPeriodChange={setActivePeriod}
                    />
                )}

                {isCurrentPeriodConfirmed ? (
                    <GroceryConfirmed />
                ) : (
                    !hasGeneratedList ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 mb-6">No grocery list found for this period.</p>
                            <button
                                onClick={handleGenerateGroceryList}
                                disabled={isGenerating}
                                className="bg-[#51754f] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#51754f]/10"
                            >
                                {isGenerating ? 'Generating...' : 'Generate New List'}
                            </button>
                            {generationError && <p className="text-red-500 mt-4">{generationError}</p>}
                        </div>
                    ) : safeCategories.length === 0 ? (
                        <GroceryEmptyState
                            selectedCategory={selectedCategory}
                            onGenerate={handleGenerateGroceryList}
                        />
                    ) : (
                        <div className="mt-2 md:mt-6">
                            <GroceryListExpanded
                                categories={safeCategories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                                isItemChecked={isItemChecked}
                                onToggleItem={toggleItemChecked}
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
