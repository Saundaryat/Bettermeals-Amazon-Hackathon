import { Check } from 'lucide-react';
import { GroceryItem as GroceryItemType } from '../model/groceries.types';

interface GroceryItemProps {
    item: GroceryItemType;
    isChecked: boolean;
    onToggle: (id: string) => void;
}

export default function GroceryItem({ item, isChecked, onToggle }: GroceryItemProps) {
    return (
        <div
            className={`grocery-item-container ${isChecked ? 'grocery-item-container-checked' : ''}`}
            onClick={() => onToggle(item.id)}
        >
            <div className="grocery-item-avatar-wrapper">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="grocery-item-avatar-img"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[10px] text-gray-400 capitalize">{item.name.charAt(0)}</span>
                    </div>
                )}
                {isChecked && (
                    <div className="grocery-item-checkmark-badge shadow-sm">
                        <Check size={8} className="text-white" strokeWidth={4} />
                    </div>
                )}
            </div>

            <div className="grocery-item-content">
                <div className="grocery-item-header">
                    <p className={`grocery-item-name ${isChecked ? 'grocery-item-name-checked' : 'grocery-item-name-unchecked'}`}>
                        {item.name}
                    </p>
                    <div className="flex gap-1">
                        {item.perishable && (
                            <span className="grocery-item-tag grocery-item-tag-perishable">
                                Perish
                            </span>
                        )}
                        {item.optional && (
                            <span className="grocery-item-tag grocery-item-tag-optional">
                                Opt
                            </span>
                        )}
                        {item.isStaple && (
                            <span className="grocery-item-tag grocery-item-tag-staple">
                                Staple
                            </span>
                        )}
                    </div>
                </div>
                <div className="grocery-item-details">
                    <p className={`grocery-item-quantity ${isChecked ? 'grocery-item-quantity-checked' : 'grocery-item-quantity-unchecked'}`}>{item.quantity}</p>
                </div>
            </div>
        </div>
    );
}
