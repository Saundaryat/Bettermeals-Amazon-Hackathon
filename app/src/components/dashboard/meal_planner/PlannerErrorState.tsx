import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlannerErrorStateProps {
    onRetry: () => void;
    error?: string;
}

export function PlannerErrorState({ onRetry, error }: PlannerErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load planner</h3>
            <p className="text-gray-500 max-w-sm mb-6">
                {error || "We encountered an unexpected issue while fetching your meal plan. Please try again."}
            </p>
            <Button
                onClick={onRetry}
                variant="outline"
                className="gap-2"
            >
                <RefreshCcw className="h-4 w-4" />
                Retry
            </Button>
        </div>
    );
}
