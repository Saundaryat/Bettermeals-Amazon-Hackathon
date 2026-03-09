import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface GroceryEmptyStateProps {
    selectedCategory: string;
    onGenerate: () => void;
}

export default function GroceryEmptyState({ selectedCategory, onGenerate }: GroceryEmptyStateProps) {
    return (
        <div className="grocery-generator-container">
            <div className="grocery-generator-icon-wrapper">
                <ShoppingBag className="grocery-generator-icon" />
            </div>
            {selectedCategory === 'all' ? (
                <>
                    <h3 className="grocery-generator-title">All Caught Up!</h3>
                    <p className="grocery-generator-desc">
                        Your pantry is stocked up with all the ingredients you need.
                        There is nothing to order right now.
                    </p>
                    {/* <button
                        onClick={onGenerate}
                        className="grocery-generator-btn grocery-generator-btn-active"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>Generate New List</span>
                    </button> */}
                </>
            ) : (
                <>
                    <h3 className="grocery-generator-title">No Items Found</h3>
                    <p className="grocery-generator-desc">
                        No items match the selected category.
                    </p>
                </>
            )}
        </div>
    );
}
