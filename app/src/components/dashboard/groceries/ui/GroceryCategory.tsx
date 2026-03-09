import React from 'react';
import { GroceryCategory as GroceryCategoryType } from '../model/groceries.types';
import GroceryItem from './GroceryItem';

interface GroceryCategoryProps {
    category: GroceryCategoryType;
    isItemChecked: (id: string) => boolean;
    onToggleItem: (id: string) => void;
}

export default function GroceryCategory({ category, isItemChecked, onToggleItem }: GroceryCategoryProps) {
    const completedCount = category.items.filter(item => isItemChecked(item.id)).length;

    return (
        <div className="grocery-category-card">
            <div className="grocery-category-header">
                <h3 className="grocery-category-title">{category.name}</h3>
                <p className="grocery-category-count">
                    {completedCount} at {category.items.length}
                </p>
            </div>

            <div className="grocery-category-list-container">
                <div className="grocery-category-list">
                    {[...category.items]
                        .sort((a, b) => {
                            const aChecked = isItemChecked(a.id);
                            const bChecked = isItemChecked(b.id);
                            if (aChecked === bChecked) return 0;
                            return aChecked ? 1 : -1;
                        })
                        .map((item) => (
                            <GroceryItem
                                key={item.id}
                                item={item}
                                isChecked={isItemChecked(item.id)}
                                onToggle={onToggleItem}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
