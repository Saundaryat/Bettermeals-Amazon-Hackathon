import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface GroceryGeneratorProps {
    onGenerate: () => void;
    isGenerating?: boolean;
    error?: string | null;
}

export default function GroceryGenerator({ onGenerate, isGenerating = false, error }: GroceryGeneratorProps) {
    return (
        <div className="grocery-generator-container">
            <div className="grocery-generator-icon-wrapper">
                <ShoppingBag className="grocery-generator-icon" />
            </div>
            <h3 className="grocery-generator-title">
                No Grocery List Found
            </h3>
            <p className="grocery-generator-desc">
                It looks like you don't have a grocery list for this week yet.
                Generate one based on your meal plan to get started!
            </p>

            {error && (
                <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
                    {error}
                </div>
            )}

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`
                    grocery-generator-btn
                    ${isGenerating
                        ? 'grocery-generator-btn-generating'
                        : 'grocery-generator-btn-active'}
                `}
            >
                {isGenerating ? (
                    <>
                        <div className="grocery-generator-spinner" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <span>Generate Grocery List</span>
                    </>
                )}
            </button>
        </div>
    );
}
