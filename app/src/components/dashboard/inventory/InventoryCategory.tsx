import React from 'react';
import { GroceryCategory as GroceryCategoryType } from '../groceries/model/groceries.types';
import InventoryItem from './InventoryItem';

interface InventoryCategoryProps {
    category: GroceryCategoryType;
    hasItem: (id: string) => boolean;
    onToggleItem: (id: string) => void;
}

export default function InventoryCategory({ category, hasItem, onToggleItem }: InventoryCategoryProps) {
    const completedCount = category.items.filter(item => hasItem(item.id)).length;

    return (
        <div className="grocery-category-card">
            <div className="grocery-category-header">
                <h3 className="grocery-category-title">{category.name}</h3>
                <p className="grocery-category-count">
                    {completedCount}/{category.items.length} in stock
                </p>
            </div>

            <div className="grocery-category-list-container">
                <div className="grocery-category-list">
                    {category.items.map((item) => (
                        <InventoryItem
                            key={item.id}
                            item={item}
                            hasItem={hasItem(item.id)}
                            onToggle={onToggleItem}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
