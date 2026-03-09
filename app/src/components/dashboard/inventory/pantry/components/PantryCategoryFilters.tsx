import React from 'react';
import '../pantry.css';
import { CategoryFilter } from '../hooks/usePantryFiltering';

interface PantryCategoryFiltersProps {
    categories: CategoryFilter[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function PantryCategoryFilters({
    categories,
    selectedCategory,
    onSelectCategory
}: PantryCategoryFiltersProps) {
    return (
        <div className="pantry-category-filter-container">
            <div className="pantry-category-filter-scroll">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onSelectCategory(category.name)}
                        className={`pantry-category-filter-btn ${selectedCategory === category.name
                            ? 'pantry-category-filter-btn-active'
                            : 'pantry-category-filter-btn-inactive'
                            }`}
                    >
                        {category.label}
                        <span className={`pantry-category-filter-count ${selectedCategory === category.name
                            ? 'pantry-category-filter-count-active'
                            : 'pantry-category-filter-count-inactive'
                            }`}>
                            {category.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
