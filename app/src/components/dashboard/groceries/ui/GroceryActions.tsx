import React from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';


interface GroceryActionsProps {
    onMarkAsOrdered?: () => void;
    isMarking?: boolean;
    selectedCount?: number;
}

export default function GroceryActions({ onMarkAsOrdered, isMarking = false, selectedCount = 0 }: GroceryActionsProps) {
    if (selectedCount === 0) return null;

    return (
        <button
            className="flex items-center gap-2 px-4 py-2 bg-[#f7e6cf] text-black rounded-full text-xs md:text-sm lg:text-base lg:px-8 lg:py-3 font-medium leading-6 hover:bg-[#f7e6cf]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onMarkAsOrdered}
            disabled={isMarking || selectedCount === 0}
        >
            {isMarking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
                <></>
            )}
            <span>Confirm Order ({selectedCount})</span>
        </button>
    );
}
