import React from 'react';
import { GroceriesProps } from './model/groceries.types';
import GroceryGenerator from './views/GroceryGenerator';
import GroceryEmptyState from './views/GroceryEmptyState';
import GroceryConfirmed from './views/GroceryConfirmed';
import GroceriesLoading from './feedback/GroceriesLoading';
import GroceriesError from './feedback/GroceriesError';
import GroceriesHeader from './ui/GroceriesHeader';
import CategoryFilter from './ui/CategoryFilter';
import GroceryCategory from './ui/GroceryCategory';
import GroceryActions from './ui/GroceryActions';
import PeriodSelector from './ui/PeriodSelector';
import './styles/groceries.css';
import { useGroceriesViewModel } from './hooks/useGroceriesViewModel';

export default function Groceries({ householdId }: GroceriesProps) {
  const {
    groceryListLoading,
    groceryListError,
    hasGeneratedList,
    filteredCategories,
    safeCategories,
    availablePeriods,
    activePeriod,
    selectedCategory,
    checkedItemsCount,
    isGenerating,
    generationError,
    isConfirmingOrder,
    isCurrentPeriodConfirmed,
    setActivePeriod,
    setSelectedCategory,
    toggleItemChecked,
    isItemChecked,
    handleGenerateGroceryList,
    handleMarkAsOrdered
  } = useGroceriesViewModel(householdId);

  if (groceryListLoading) {
    return <GroceriesLoading />;
  }

  if (groceryListError) {
    return <GroceriesError message={groceryListError} />;
  }

  return (
    <div className="groceries-page">
      <div className="groceries-container">
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
          <>
            <CategoryFilter
              categories={safeCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {!hasGeneratedList ? (
              <GroceryGenerator
                onGenerate={handleGenerateGroceryList}
                isGenerating={isGenerating}
                error={generationError}
              />
            ) : filteredCategories.length === 0 ? (
              <GroceryEmptyState
                selectedCategory={selectedCategory}
                onGenerate={handleGenerateGroceryList}
              />
            ) : (
              <div className="groceries-grid">
                {filteredCategories.map((category: any, categoryIndex: number) => (
                  <GroceryCategory
                    key={categoryIndex}
                    category={category}
                    isItemChecked={isItemChecked}
                    onToggleItem={toggleItemChecked}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
