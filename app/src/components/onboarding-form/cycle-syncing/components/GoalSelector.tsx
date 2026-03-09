import React from 'react';
import { cn } from '@/lib/utils';


interface GoalOption {
    label: string;
    icon: React.ReactNode;
}

interface GoalSelectorProps {
    selectedGoals: string[];
    onGoalToggle: (label: string) => void;
    options: GoalOption[];
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
    selectedGoals,
    onGoalToggle,
    options
}) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {options.map((option) => {
                const isSelected = selectedGoals.includes(option.label);

                return (
                    <button
                        key={option.label}
                        type="button"
                        onClick={() => onGoalToggle(option.label)}
                        className={cn(
                            "flex items-center gap-3 p-2.5 rounded-full border transition-all duration-200 text-sm font-semibold relative overflow-hidden",
                            isSelected
                                ? "bg-[#7A9B76] text-white border-[#7A9B76] shadow-sm"
                                : "bg-[#FFF9F0] text-[#2D332D] border-gray-100 hover:border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                            isSelected ? "bg-white/20" : "bg-white border border-gray-100"
                        )}>
                            {React.cloneElement(option.icon as React.ReactElement, {
                                className: cn("w-5 h-5", isSelected ? "text-white" : "text-[#7A9B76]")
                            })}
                        </div>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <span className="truncate">{option.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
