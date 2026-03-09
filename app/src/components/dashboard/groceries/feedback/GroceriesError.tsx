import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface GroceriesErrorProps {
    message: string;
}

export default function GroceriesError({ message }: GroceriesErrorProps) {
    return (
        <div className="bg-white p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-black mb-2">Failed to Load Grocery List</h2>
                        <p className="text-black/70 mb-4">{message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#51754f] hover:bg-[#51754f]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
