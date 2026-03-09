import React from 'react';
import { CheckCircle, Circle, Package } from 'lucide-react';
import { GroceryItem } from '../../groceries/model/groceries.types';

interface InventoryItemProps {
    item: GroceryItem;
    hasItem: boolean;
    onToggle: (id: string) => void;
}

export default function PantryItem({ item, hasItem, onToggle }: InventoryItemProps) {
    // Placeholder image logic - in a real app this would come from the item data
    const imageUrl = item.image_url || null;

    return (
        <div
            className={`pantry-item-card group ${hasItem ? 'pantry-item-card-active' : ''
                }`}
            onClick={() => onToggle(item.id)}
        >
            <div className="pantry-item-image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="pantry-item-image"
                    />
                ) : (
                    <div className="pantry-item-placeholder-container">
                        <Package size={24} className="pantry-item-placeholder-icon" />
                    </div>
                )}

                <div className="pantry-item-check-container">
                    {hasItem ? (
                        <CheckCircle size={22} className="pantry-item-check-active" />
                    ) : (
                        <Circle size={22} className="pantry-item-check-inactive" />
                    )}
                </div>
            </div>

            <div className="pantry-item-content">
                <p className="pantry-item-title">{item.name}</p>
                {/* <p className="pantry-item-subtitle">
                    {item.subcategory || item.category}
                </p> */}
            </div>
        </div>
    );
}
