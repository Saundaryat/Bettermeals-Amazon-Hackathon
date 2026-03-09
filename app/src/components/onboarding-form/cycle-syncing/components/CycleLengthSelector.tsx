import React from 'react';
import { cn } from '@/lib/utils';

interface CycleLengthOption {
    label: string;
    days: number;
}

interface CycleLengthSelectorProps {
    currentLength: number;
    onLengthChange: (length: number) => void;
    options?: CycleLengthOption[];
}

const DEFAULT_OPTIONS: CycleLengthOption[] = [
    { label: "DAY 1", days: 1 },
    { label: "DAY 2", days: 2 },
    { label: "DAY 3", days: 3 },
    { label: "DAY 4", days: 4 },
    { label: "DAY 5", days: 5 },
    { label: "DAY 6", days: 6 },
    { label: "DAY 7", days: 7 },
];

export const CycleLengthSelector: React.FC<CycleLengthSelectorProps> = ({
    currentLength,
    onLengthChange,
    options = DEFAULT_OPTIONS
}) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-[#FFF9F0] shadow-sm">
            <div className="flex justify-between items-end">
                {options.map((option) => {
                    const isSelected = currentLength === option.days;

                    return (
                        <button
                            key={option.days}
                            type="button"
                            onClick={() => onLengthChange(option.days)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div
                                className={cn(
                                    "w-6 transition-all",
                                    isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-60"
                                )}
                                style={{ height: '56px' }}
                            >
                                <svg viewBox="0 0 100 150" className="w-full h-full">
                                    <path
                                        d="M50 10 Q30 40 30 80 Q30 120 50 140 Q70 120 70 80 Q70 40 50 10 Z"
                                        className={cn(
                                            "transition-all",
                                            isSelected ? "fill-[#51754f]" : "fill-gray-300"
                                        )}
                                    />
                                </svg>
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
                                isSelected ? "text-gray-900" : "text-gray-500"
                            )}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
