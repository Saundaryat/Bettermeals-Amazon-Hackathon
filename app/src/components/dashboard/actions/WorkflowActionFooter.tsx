import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface WorkflowActionFooterProps {
    onBack?: () => void;
    onPrimary: () => void;
    primaryLabel: string;
    isPrimaryDisabled?: boolean;
    isPrimaryLoading?: boolean;
    showBack?: boolean;
}

export function WorkflowActionFooter({
    onBack,
    onPrimary,
    primaryLabel,
    isPrimaryDisabled = false,
    isPrimaryLoading = false,
    showBack = false
}: WorkflowActionFooterProps) {
    return (
        <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 lg:left-64 pointer-events-none p-4 sm:p-6 flex justify-center items-stretch space-x-3 sm:space-x-4 z-40">
            {showBack && onBack && (
                <button
                    onClick={onBack}
                    className="pointer-events-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-500 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-bold hover:bg-gray-50 transition-all transform active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[10px] sm:text-sm uppercase tracking-wider">Back</span>
                </button>
            )}
            <button
                onClick={onPrimary}
                disabled={isPrimaryDisabled || isPrimaryLoading}
                className="pointer-events-auto flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#51754f] text-white px-4 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-bold shadow-lg shadow-[#51754f]/20 hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-50"
            >
                <span className="text-[10px] sm:text-sm uppercase tracking-wider">
                    {isPrimaryLoading ? 'Processing...' : primaryLabel}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </button>
        </div>
    );
}
