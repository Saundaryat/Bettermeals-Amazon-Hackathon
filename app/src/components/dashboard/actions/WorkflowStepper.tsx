import React from 'react';
import { Check } from 'lucide-react';

interface Step {
    id: number;
    label: string;
}

interface WorkflowStepperProps {
    currentStep: number;
    steps: Step[];
}

export default function WorkflowStepper({ currentStep, steps }: WorkflowStepperProps) {
    return (
        <div className="flex items-center justify-between w-full px-1.5 py-2 bg-white rounded-2xl border border-gray-100 mb-1 overflow-x-auto no-scrollbar">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center gap-2 group flex-1 min-w-[75px] md:min-w-[100px]">
                            {/* Step Indicator */}
                            <div className={`
                                w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                ${isActive
                                    ? 'bg-[#51754f] border-[#51754f] text-white shadow-lg shadow-[#51754f]/20 scale-110'
                                    : isCompleted
                                        ? 'bg-[#51754f] border-[#51754f] text-white'
                                        : 'bg-white border-gray-200 text-gray-400'
                                }
                            `}>
                                {isCompleted ? (
                                    <Check className="w-4 h-4 md:w-6 md:h-6" />
                                ) : (
                                    <span className="text-xs md:text-base font-bold">{step.id}</span>
                                )}
                            </div>

                            {/* Step Label */}
                            <span className={`
                                text-[9px] md:text-xs font-bold uppercase tracking-widest text-center px-0.5
                                ${isActive ? 'text-gray-900' : 'text-gray-400'}
                            `}>
                                {step.label}
                            </span>
                        </div>

                        {/* Visual Connector Line */}
                        {!isLast && (
                            <div className="flex-1 h-[2px] min-w-[15px] mx-1 md:mx-2 -mt-6">
                                <div className={`h-full w-full transition-all duration-500 rounded-full
                                    ${isCompleted ? 'bg-[#51754f]' : 'bg-gray-200'}
                                `} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
