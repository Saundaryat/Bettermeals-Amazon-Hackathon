import React, { ReactNode } from 'react';

interface GroceriesHeaderProps {
    children?: ReactNode;
}

export default function GroceriesHeader({ children }: GroceriesHeaderProps) {
    return (
        <>
            {/* Header */}
            {/* Header */}
            <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">
                        Grocery List
                    </h1>
                    <div className="flex items-center gap-3 text-black/70 text-sm lg:text-base">
                        <p>Items to purchase for your upcoming meals.</p>
                    </div>
                </div>
                {children && (
                    <div className="flex-shrink-0">
                        {children}
                    </div>
                )}
            </div>

            {/* View Tabs */}
            {/* <div className="groceries-header-tabs-container">
                <div className="groceries-header-tabs-wrapper">
                    <button
                        onClick={() => onViewChange('groceries')}
                        className={`groceries-header-tab ${activeView === 'groceries'
                            ? 'groceries-header-tab-active'
                            : 'groceries-header-tab-inactive'
                            }`}
                    >
                        Grocery List
                    </button>
                    <button
                        onClick={() => onViewChange('inventory')}
                        className={`groceries-header-tab ${activeView === 'inventory'
                            ? 'groceries-header-tab-active'
                            : 'groceries-header-tab-inactive'
                            }`}
                    >
                        Inventory
                    </button>
                </div>
            </div> */}

            {/* <div className="groceries-header-desc-container">
                <p className="groceries-header-desc">
                    {activeView === 'groceries'
                        ? "Ingredients to buy for this week."
                        : "Items you already have."}
                </p>
            </div> */}
        </>
    );
}
