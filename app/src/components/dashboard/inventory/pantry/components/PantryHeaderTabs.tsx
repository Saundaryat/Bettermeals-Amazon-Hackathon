import React from 'react';
import '../pantry.css';

export type PantryActiveView = 'add' | 'view';

interface PantryHeaderTabsProps {
    viewMode: PantryActiveView;
    setViewMode: (mode: PantryActiveView) => void;
}

export default function PantryHeaderTabs({ viewMode, setViewMode }: PantryHeaderTabsProps) {
    return (
        <div className="groceries-header-tabs-container">
            <div className="groceries-header-tabs-wrapper">
                <button
                    onClick={() => setViewMode('add')}
                    className={`groceries-header-tab ${viewMode === 'add'
                        ? 'groceries-header-tab-active'
                        : 'groceries-header-tab-inactive'
                        }`}
                >
                    Add items
                </button>
                <button
                    onClick={() => setViewMode('view')}
                    className={`groceries-header-tab ${viewMode === 'view'
                        ? 'groceries-header-tab-active'
                        : 'groceries-header-tab-inactive'
                        }`}
                >
                    View pantry
                </button>
            </div>
        </div>
    );
}
