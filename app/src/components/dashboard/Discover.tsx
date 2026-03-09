import React from 'react';
import { Search, Star, Clock, Heart, TrendingUp, Filter } from 'lucide-react';

import { PLACEHOLDER_IMAGE_URL } from '@/utils/imageUrl';

interface DiscoverProps { }

export default function Discover({ }: DiscoverProps) {
  // Mock discovery data
  const featuredRecipes = [
    {
      id: '1',
      name: 'Mediterranean Quinoa Bowl',
      image: PLACEHOLDER_IMAGE_URL,
      rating: 4.8,
      cookTime: '25 min',
      difficulty: 'Easy',
      tags: ['Healthy', 'Vegetarian', 'Quick']
    },
    {
      id: '2',
      name: 'Asian Glazed Salmon',
      image: PLACEHOLDER_IMAGE_URL,
      rating: 4.9,
      cookTime: '20 min',
      difficulty: 'Medium',
      tags: ['Protein', 'Asian', 'Gluten-Free']
    },
    {
      id: '3',
      name: 'Creamy Mushroom Pasta',
      image: PLACEHOLDER_IMAGE_URL,
      rating: 4.7,
      cookTime: '30 min',
      difficulty: 'Easy',
      tags: ['Comfort', 'Vegetarian', 'Italian']
    },
    {
      id: '4',
      name: 'Spicy Thai Curry',
      image: PLACEHOLDER_IMAGE_URL,
      rating: 4.6,
      cookTime: '35 min',
      difficulty: 'Medium',
      tags: ['Spicy', 'Thai', 'Vegan']
    }
  ];

  const trendingCategories = [
    { name: 'Quick & Easy', count: 45, color: 'bg-black/5 text-black border-black/10' },
    { name: 'Healthy', count: 32, color: 'bg-black/5 text-black border-black/10' },
    { name: 'Comfort Food', count: 28, color: 'bg-black/5 text-black border-black/10' },
    { name: 'Vegetarian', count: 24, color: 'bg-black/5 text-black border-black/10' },
    { name: 'Gluten-Free', count: 19, color: 'bg-black/5 text-black border-black/10' },
    { name: 'High Protein', count: 16, color: 'bg-black/5 text-black border-black/10' }
  ];

  const recentSearches = [
    'Chicken recipes',
    'Healthy breakfast',
    'Quick dinner',
    'Vegetarian pasta',
    'Low carb meals'
  ];

  return (
    <div className="bg-white p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">Discover Recipes</h1>
          <p className="text-black/70 text-sm lg:text-base">Find your next favorite meal</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 lg:mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-black/50" size={18} />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or cuisines..."
              className="w-full pl-10 lg:pl-12 pr-20 lg:pr-24 py-3 lg:py-4 border border-black/10 rounded-lg focus:ring-2 focus:ring-[#51754f] focus:border-transparent text-sm lg:text-lg bg-white"
            />
            <button className="absolute right-1 lg:right-2 top-1/2 transform -translate-y-1/2 bg-[#f7e6cf] text-black px-3 lg:px-6 py-1.5 lg:py-2 rounded-md hover:bg-[#f7e6cf]/90 transition-colors border border-[#f7e6cf] text-sm lg:text-base">
              Search
            </button>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-black mb-3 lg:mb-4 flex items-center space-x-2">
            <TrendingUp size={18} className="lg:w-5 lg:h-5 text-[#51754f]" />
            <span>Trending Categories</span>
          </h2>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {trendingCategories.map((category, index) => (
              <button
                key={index}
                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-colors hover:bg-black/10 border ${category.color}`}
              >
                <span className="hidden sm:inline">{category.name} ({category.count})</span>
                <span className="sm:hidden">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-black mb-3 lg:mb-4">Featured Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-zen transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-black/5">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-40 lg:h-48 object-cover"
                  />
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="font-semibold text-black mb-2 line-clamp-2 text-sm lg:text-base">{recipe.name}</h3>

                  <div className="flex items-center space-x-3 lg:space-x-4 mb-2 lg:mb-3 text-xs lg:text-sm text-black/70">
                    <div className="flex items-center space-x-1">
                      <Star size={12} className="lg:w-3.5 lg:h-3.5 text-yellow-400 fill-current" />
                      <span>{recipe.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="lg:w-3.5 lg:h-3.5" />
                      <span>{recipe.cookTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2 lg:mb-3">
                    {recipe.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-1.5 lg:px-2 py-0.5 lg:py-1 bg-black/5 text-black text-xs rounded border border-black/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-black/70">{recipe.difficulty}</span>
                    <button className="p-1.5 lg:p-2 hover:bg-black/5 rounded-full transition-colors">
                      <Heart size={14} className="lg:w-4 lg:h-4 text-black/40" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-black mb-3 lg:mb-4">Recent Searches</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="px-3 lg:px-4 py-1.5 lg:py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-xs lg:text-sm transition-colors border border-black/10"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <button className="bg-[#f7e6cf] hover:bg-[#f7e6cf]/90 text-black px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 border border-[#f7e6cf] text-sm lg:text-base">
            <Filter size={18} className="lg:w-5 lg:h-5" />
            <span>Advanced Filters</span>
          </button>

          <button className="bg-black/5 hover:bg-black/10 text-black px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 border border-black/10 text-sm lg:text-base">
            <Heart size={18} className="lg:w-5 lg:h-5" />
            <span>View Favorites</span>
          </button>

          <button className="bg-black/5 hover:bg-black/10 text-black px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 border border-black/10 text-sm lg:text-base">
            <TrendingUp size={18} className="lg:w-5 lg:h-5" />
            <span>Trending Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
