import React, { useState, useMemo } from 'react';
import { Leaf } from 'lucide-react';
import { GroceryCategory, GroceryItem as GroceryItemType } from '../model/groceries.types';
import GroceryItem from './GroceryItem';

interface GroceryListExpandedProps {
    categories: GroceryCategory[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    isItemChecked: (id: string) => boolean;
    onToggleItem: (id: string) => void;
}

type SubFilter = 'All' | 'Perish' | 'Staples' | 'Optional';

export default function GroceryListExpanded({
    categories,
    selectedCategory,
    onSelectCategory,
    isItemChecked,
    onToggleItem
}: GroceryListExpandedProps) {
    const [subFilter, setSubFilter] = useState<SubFilter>('All');

    // Find the currently selected category object
    // If selectedCategory is 'all', we default to the first category or handle it gracefully
    // The parent should ideally pass a specific category, but we'll fallback to first if needed.
    const activeCategory = useMemo(() => {
        if (!categories.length) return null;
        if (selectedCategory === 'all') return categories[0];
        return categories.find(c => c.name === selectedCategory) || categories[0];
    }, [categories, selectedCategory]);

    const filteredItems = useMemo(() => {
        if (!activeCategory) return [];
        let items = activeCategory.items;

        if (subFilter === 'Perish') {
            items = items.filter(i => i.perishable);
        } else if (subFilter === 'Staples') {
            items = items.filter(i => i.isStaple);
        } else if (subFilter === 'Optional') {
            items = items.filter(i => i.optional);
        }

        // Sort items: checked items last
        return [...items].sort((a, b) => {
            const aChecked = isItemChecked(a.id);
            const bChecked = isItemChecked(b.id);
            if (aChecked === bChecked) return 0;
            return aChecked ? 1 : -1;
        });
    }, [activeCategory, subFilter, isItemChecked]);

    const completedCount = activeCategory
        ? activeCategory.items.filter(item => isItemChecked(item.id)).length
        : 0;

    const totalCount = activeCategory ? activeCategory.items.length : 0;

    if (!activeCategory) return null;

    return (
        <div className="flex flex-col md:flex-row gap-6 h-auto md:h-full min-h-0 md:min-h-[500px]">
            {/* Categories: Horizontal Scroll on Mobile, Sidebar on Desktop */}
            <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                <h3 className="hidden md:block text-xl font-bold mb-2 px-2">Grocery List</h3>

                {/* Mobile Header: Removed redundant header */}
                <div className="md:hidden mb-2"></div>

                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-[600px] pb-2 md:pb-0 pr-2 scrollbar-thin scrollbar-hide">
                    {categories.map((category) => {
                        const isSelected = activeCategory.name === category.name;

                        return (
                            <button
                                key={category.name}
                                onClick={() => onSelectCategory(category.name)}
                                className={`
                                    flex-shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all duration-200 flex items-center justify-between group whitespace-nowrap text-xs md:text-sm font-medium
                                    ${isSelected
                                        ? 'bg-[#dcfcdc] text-black shadow-sm border md:border-none border-[#51754f]/10'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 md:border-none'
                                    }
                                `}
                            >
                                <span>{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Content: Items */}
            <div className="w-full md:flex-1 bg-white md:rounded-3xl p-0 md:p-6 md:shadow-sm md:border border-gray-100 flex flex-col h-auto md:h-full overflow-hidden">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h2 className="hidden md:flex text-xl md:text-2xl font-bold flex-wrap items-baseline gap-2">
                            {activeCategory.name}
                            <span className="text-sm md:text-lg font-medium text-gray-400 whitespace-nowrap">
                                • {completedCount} of {totalCount} items
                            </span>
                        </h2>

                        {/* Sub-filters */}
                        <div className="flex gap-2 overflow-x-auto max-w-full pb-1 scrollbar-hide">
                            {(['All', 'Perish', 'Staples', 'Optional'] as SubFilter[]).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSubFilter(filter)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap border
                                        ${subFilter === filter
                                            ? 'bg-black text-white border-black shadow-sm'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {filter === 'Perish' ? 'Perish' : filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 overflow-y-visible md:overflow-y-auto w-full md:flex-1 pr-1 scrollbar-thin pb-24 md:pb-0">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                            No {subFilter !== 'All' ? subFilter.toLowerCase() : ''} items in this category.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <GroceryItem
                                key={item.id}
                                item={item}
                                isChecked={isItemChecked(item.id)}
                                onToggle={onToggleItem}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
