import React from 'react';
import GroceriesLoading from '../../groceries/feedback/GroceriesLoading';
import GroceriesError from '../../groceries/feedback/GroceriesError';
import { usePantryLogic } from './hooks/usePantryLogic';
import PantryOnboarding from './PantryOnboarding';
import './pantry.css';

interface SetupPantryProps {
    householdId?: string;
}

export default function SetupPantry({ householdId }: SetupPantryProps) {
    const {
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
    } = usePantryLogic(householdId);

    if (isInventoryLoading) return <GroceriesLoading />;
    if (inventoryError) return <GroceriesError message={(inventoryError as Error).message} />;

    return (
        <PantryOnboarding
            staples={staples}
            perishables={perishables}
            hasItem={hasItem}
            onToggle={toggleInventoryItem}
            onFinish={handleFinishOnboarding}
            isUpdating={isUpdating}
            selectedCount={newlySelectedCount}
            householdId={householdId}
        />
    )
}
