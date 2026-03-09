import React from 'react';
import { MealDetails } from "../types";

interface IngredientsGridProps {
    ingredients: MealDetails['ingredients'];
}

export const IngredientsGrid: React.FC<IngredientsGridProps> = ({ ingredients }) => {
    if (!ingredients || ingredients.length === 0) return null;

    return (
        <div>
            <h3 className="font-semibold mb-4">Ingredients</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6">
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-gray-200 transition-colors">
                            {ingredient.media?.image_url_thumbnail || ingredient.media?.image_url ? (
                                <img
                                    src={ingredient.media.image_url_thumbnail || ingredient.media?.image_url}
                                    alt={ingredient.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log('Ingredient image failed to load:', ingredient.media?.image_url);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <span className={`text-xl md:text-2xl ${ingredient.media?.image_url ? 'hidden' : ''}`}>🥄</span>
                        </div>
                        <h4 className="font-medium text-xs md:text-sm text-gray-900 line-clamp-2 leading-tight">
                            {ingredient.name}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                            {ingredient.amount}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
