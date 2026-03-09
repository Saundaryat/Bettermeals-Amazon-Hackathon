import React from 'react';
import WorkflowStepper from './WorkflowStepper';

interface PendingActionsHeaderProps {
    currentStep: number;
    dateRangeStr: string;
    steps: { id: number; label: string }[];
}

export function PendingActionsHeader({ currentStep, dateRangeStr, steps }: PendingActionsHeaderProps) {
    return (
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 py-2 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col items-start text-left">
                    <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2 flex flex-col sm:flex-row sm:items-baseline tracking-tight">
                        <span className="whitespace-nowrap">Weekly Plan Review</span>
                        <span className="sm:ml-4 text-sm lg:text-base text-black/70 font-medium normal-case tracking-normal mt-0.5 sm:mt-0 opacity-100">
                            ({dateRangeStr})
                        </span>
                    </h1>

                    <div className="w-full flex justify-start">
                        {currentStep !== 4 && <WorkflowStepper currentStep={currentStep} steps={steps} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
