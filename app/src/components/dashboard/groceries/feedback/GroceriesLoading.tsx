import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GroceriesLoading() {
    return (
        <div className="bg-white p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#51754f]" />
                        <h2 className="text-lg font-semibold text-black mb-2">Loading Grocery List</h2>
                        <p className="text-black/70">Please wait while we fetch your groceries...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
