import React from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { usePendingActionsWorkflow } from './hooks/usePendingActionsWorkflow';
import { PendingActionsHeader } from './PendingActionsHeader';
import { MealReviewStep } from './MealReviewStep';
import { WorkflowActionFooter } from './WorkflowActionFooter';
import InventoryStep from './InventoryStep';
import GroceryStep from './GroceryStep';
import SuccessScreen from './SuccessScreen';
import MealDetailModal from '@/components/dashboard/meal_modal/MealDetailModal';
import { EmptyMealPlanState } from '@/components/dashboard/meal_planner/EmptyMealPlanState';

interface PendingActionsProps {
    householdId: string;
    onNavigate: (tab: 'planner' | 'groceries' | 'pantry' | 'actions' | 'profile') => void;
}

const STEPS = [
    { id: 1, label: 'REVIEW MEALS' },
    { id: 2, label: 'UPDATE INVENTORY' },
    { id: 3, label: 'GENERATED SHOPPING LIST' }
];

export default function PendingActions({ householdId, onNavigate }: PendingActionsProps) {
    const workflow = usePendingActionsWorkflow(householdId);

    // Loading State
    if (workflow.isLoading) {
        return (
            <div className="min-h-screen bg-white p-4 lg:p-8 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-100 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-48 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-32"></div>
                </div>
            </div>
        );
    }

    // Error State
    if (workflow.shouldShowError) {
        return (
            <div className="min-h-screen bg-white p-4 lg:p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500">Unable to load your weekly workflow. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-12 lg:pb-8">
            {/* Header */}
            <PendingActionsHeader
                currentStep={workflow.currentStep}
                dateRangeStr={workflow.dateRangeStr}
                steps={STEPS}
            />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 lg:px-6 mt-4 sm:mt-6">

                {/* Step 1: Meal Review or Generate Meal Plan */}
                {workflow.currentStep === 1 && (
                    workflow.hasRealMealPlan ? (
                        <MealReviewStep
                            selectedDay={workflow.selectedDay}
                            onDayChange={workflow.handleDayChange}
                            nextWeekStart={workflow.nextWeekStart}
                            currentDayMeals={workflow.currentDayMealsFiltered}
                            onMealClick={workflow.handleMealClick}
                            onApprove={workflow.handleApproveMeals}
                            isApproving={workflow.isUpdatingStatus}
                        />
                    ) : (
                        <EmptyMealPlanState
                            isGenerating={workflow.isGeneratingMealPlan}
                            generationError={workflow.mealPlanGenerationError}
                            onGenerate={workflow.handleGenerateMealPlan}
                        />
                    )
                )}

                {/* Step 2: Inventory */}
                {workflow.currentStep === 2 && (
                    <div className="pb-36 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-6xl mx-auto px-1">
                            <InventoryStep
                                householdId={householdId}
                                onSelectionChange={(count, saveCallback) => {
                                    workflow.setInventorySelectionCount(count);
                                    workflow.setInventorySaveCallback(() => saveCallback);
                                }}
                                onInventoryUpdated={workflow.handleInventoryUpdated}
                            />
                        </div>

                        {/* Inventory Action Footer */}
                        <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 lg:left-64 pointer-events-none p-4 sm:p-6 flex justify-center items-stretch space-x-3 sm:space-x-4 z-40">
                            <button
                                onClick={() => workflow.setCurrentStep(1)}
                                className="pointer-events-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-500 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-bold hover:bg-gray-50 transition-all transform active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-[10px] sm:text-sm uppercase tracking-wider">Back</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (workflow.inventorySaveCallback) {
                                        workflow.inventorySaveCallback();
                                    }
                                }}
                                disabled={workflow.isGeneratingGroceries || workflow.isUpdatingStatus}
                                className="pointer-events-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#51754f] text-white px-4 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-bold shadow-lg shadow-[#51754f]/20 hover:scale-[1.02] transition-all transform active:scale-95"
                            >
                                <span className="text-[10px] sm:text-sm uppercase tracking-wider text-center">
                                    {workflow.isGeneratingGroceries || workflow.isUpdatingStatus ? 'Processing...' : (
                                        <>
                                            <span className="sm:hidden">Confirm ({workflow.inventorySelectionCount})</span>
                                            <span className="hidden sm:inline">Confirm Inventory ({workflow.inventorySelectionCount} items selected)</span>
                                        </>
                                    )}
                                </span>
                                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Grocery List */}
                {workflow.currentStep === 3 && (
                    <div className="animate-in fade-in duration-500 pb-36">
                        <div className="space-y-4 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-sm border border-gray-100">
                                <GroceryStep householdId={householdId} forNextWeek={true} />
                            </div>

                            <WorkflowActionFooter
                                showBack
                                onBack={() => workflow.setCurrentStep(2)}
                                onPrimary={workflow.handleFinishGrocery}
                                primaryLabel={workflow.isUpdatingStatus ? 'Finishing...' : 'Finish'}
                                isPrimaryDisabled={workflow.isUpdatingStatus}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {workflow.currentStep === 4 && (
                    <SuccessScreen
                        onComplete={() => onNavigate('groceries')}
                        dateRangeStr={workflow.dateRangeStr}
                    />
                )}
            </div>

            {/* Meal Detail Modal */}
            <MealDetailModal
                isOpen={workflow.isMealDetailOpen}
                mealId={workflow.selectedMealId || 'unknown'}
                onClose={workflow.handleCloseMealDetail}
                initialImageUrl={workflow.selectedMealImage}
                onReplaceMeal={workflow.handleReplaceMeal}
                mealPlanData={workflow.realMealPlanData}
                addonsData={workflow.realAddonsData}
                imagesPreloaded={workflow.imagesPreloaded}
            />
        </div>
    );
}
