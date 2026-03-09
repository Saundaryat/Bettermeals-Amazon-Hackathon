import React from 'react';
import { CheckCircle, Circle, Package } from 'lucide-react';
import { GroceryItem } from '../groceries/model/groceries.types';

interface InventoryItemProps {
    item: GroceryItem;
    hasItem: boolean;
    onToggle: (id: string) => void;
}

export default function InventoryItem({ item, hasItem, onToggle }: InventoryItemProps) {
    const imageUrl = item.image_url || null;

    return (
        <div className="grocery-item-container">
            <button
                className="grocery-item-checkbox-btn"
                onClick={() => onToggle(item.id)}
            >
                {hasItem ? (
                    <CheckCircle size={14} className="grocery-item-checkbox-checked" />
                ) : (
                    <Circle size={14} className="grocery-item-checkbox-unchecked" />
                )}
            </button>

            <div className="grocery-item-content">
                {imageUrl && (
                    <div className="grocery-item-image-wrapper">
                        <img src={imageUrl} alt={item.name} className="grocery-item-image" />
                    </div>
                )}
                
                <div className="grocery-item-header">
                    <p className={`grocery-item-name ${hasItem ? 'grocery-item-name-checked' : 'grocery-item-name-unchecked'}`}>
                        {item.name}
                    </p>
                    {item.perishable && (
                        <span className="grocery-item-tag grocery-item-tag-perishable">
                            Perish
                        </span>
                    )}
                    {item.isStaple && (
                        <span className="grocery-item-tag grocery-item-tag-staple">
                            Staple
                        </span>
                    )}
                </div>
                <div className="grocery-item-details">
                    <p className={`grocery-item-quantity ${hasItem ? 'grocery-item-quantity-checked' : 'grocery-item-quantity-unchecked'}`}>{item.quantity}</p>
                    {item.subcategory && (
                        <>
                            <span className="grocery-item-dot">•</span>
                            <p className={`grocery-item-subcategory ${hasItem ? 'grocery-item-subcategory-checked' : 'grocery-item-subcategory-unchecked'}`}>{item.subcategory}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
