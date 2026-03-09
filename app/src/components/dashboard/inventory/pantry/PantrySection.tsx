import React from 'react';
import { GroceryItem } from '../../groceries/model/groceries.types';
import PantryItem from './PantryItem';

interface PantrySectionProps {
    title: string;
    description?: string;
    items: GroceryItem[];
    hasItem: (id: string) => boolean;
    onToggle: (id: string) => void;
}

export default function PantrySection({ title, description, items, hasItem, onToggle }: PantrySectionProps) {
    if (items.length === 0) return null;

    return (
        <div>
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                {description && <p className="text-sm text-black/60">{description}</p>}
            </div> */}

            <div className="pantry-grid">
                {items.map(item => (
                    <PantryItem
                        key={item.id}
                        item={item}
                        hasItem={hasItem(item.id)}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}
