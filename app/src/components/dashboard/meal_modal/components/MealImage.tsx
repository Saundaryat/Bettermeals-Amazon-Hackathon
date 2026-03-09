import React from 'react';
import { Utensils } from "lucide-react";
import { MealDetails } from "../types";

interface MealImageProps {
    mealDetails: MealDetails | null;
    loading: boolean;
    initialImageUrl?: string;
}

export const MealImage: React.FC<MealImageProps> = ({ mealDetails, loading, initialImageUrl }) => {
    return (
        <div className="lg:w-1/2 p-4 lg:p-6 flex items-center justify-center bg-gray-50 flex-shrink-0">
            {loading ? (
                initialImageUrl ? (
                    <div className="w-48 h-48 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-lg border-4 border-white opacity-70">
                        <img
                            src={initialImageUrl}
                            alt="Loading..."
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-48 h-48 lg:w-80 lg:h-80 bg-gray-200 rounded-full animate-pulse"></div>
                )
            ) : (mealDetails?.imageUrlMid || mealDetails?.imageUrl) ? (
                <div className="w-48 h-48 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img
                        src={mealDetails.imageUrlMid || mealDetails.imageUrl}
                        alt={mealDetails.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                            console.log('Image loaded successfully:', mealDetails.imageUrlMid || mealDetails.imageUrl);
                        }}
                        onError={(e) => {
                            console.log('Image failed to load:', e.currentTarget.src);
                            const target = e.currentTarget;
                            // If we were trying to load the mid image and it failed, try the main image
                            if (mealDetails.imageUrlMid && target.src === mealDetails.imageUrlMid && mealDetails.imageUrl) {
                                console.log('Falling back to main imageUrl');
                                target.src = mealDetails.imageUrl;
                                return;
                            }
                            // If we were already on the main image or both failed, try the initial image
                            if (initialImageUrl && target.src !== initialImageUrl) {
                                console.log('Falling back to initialImageUrl');
                                target.src = initialImageUrl;
                            } else {
                                console.log('Falling back to placeholder');
                                target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop&crop=center';
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="w-48 h-48 lg:w-80 lg:h-80 bg-gray-200 rounded-full flex items-center justify-center">
                    <Utensils className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" />
                </div>
            )}
        </div>
    );
};
