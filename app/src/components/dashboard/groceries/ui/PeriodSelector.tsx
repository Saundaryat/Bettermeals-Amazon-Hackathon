import React from 'react';

interface PeriodSelectorProps {
    activePeriod: string;
    availablePeriods: string[];
    onPeriodChange: (period: string) => void;
}

export default function PeriodSelector({
    activePeriod,
    availablePeriods,
    onPeriodChange
}: PeriodSelectorProps) {

    if (availablePeriods.length <= 1) return null;

    // Helper to format period label
    const formatPeriodLabel = (periodKey: string) => {
        if (periodKey === 'full_week') return 'Full Week';
        return periodKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' - ');
    };

    return (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {/* {availablePeriods.map((period) => ( */}
            {availablePeriods
                .filter(period => period !== 'full_week')
                .map((period) => (
                    <button
                        key={period}
                        onClick={() => onPeriodChange(period)}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${activePeriod === period
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {formatPeriodLabel(period)}
                    </button>
                ))}
        </div>
    );
}
