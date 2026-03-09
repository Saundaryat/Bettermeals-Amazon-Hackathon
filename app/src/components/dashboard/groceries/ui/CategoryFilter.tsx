import React from 'react';
import { GroceryCategory } from '../model/groceries.types';

interface CategoryFilterProps {
    categories: GroceryCategory[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    if (categories.length === 0) return null;

    return (
        <div className="category-filter-container">
            <div className="category-filter-scroll">
                <button
                    onClick={() => onSelectCategory('all')}
                    className={`category-filter-btn ${selectedCategory === 'all'
                        ? 'category-filter-btn-active'
                        : 'category-filter-btn-inactive'
                        }`}
                >
                    All
                </button>
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectCategory(category.name)}
                        className={`category-filter-btn ${selectedCategory === category.name
                            ? 'category-filter-btn-active'
                            : 'category-filter-btn-inactive'
                            }`}
                    >
                        {category.name}
                        <span className={`category-filter-count ${selectedCategory === category.name ? 'category-filter-count-active' : 'category-filter-count-inactive'}`}>
                            {category.items.length}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
