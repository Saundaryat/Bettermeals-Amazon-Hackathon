import React from 'react';

/**
 * A sophisticated confirmation view shown after groceries have been confirmed.
 * Designed to feel premium and consistent with the app's aesthetic.
 */
export default function GroceryConfirmed() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full animate-in fade-in duration-500">
            <div className="relative">
                {/* Decorative background elements for a premium feel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-60"></div>

                <h2 className="relative text-3xl md:text-4xl font-serif text-[#2D2D2D] mb-4 text-center tracking-tight">
                    Groceries Confirmed
                </h2>
            </div>

            <div className="max-w-md text-center space-y-2">
                <p className="text-[#6B6B6B] text-sm md:text-base font-light leading-relaxed">
                    Your grocery list for this period has been approved.
                </p>
                <div className="h-px w-16 bg-orange-200 mx-auto mt-6"></div>
            </div>
        </div>
    );
}
