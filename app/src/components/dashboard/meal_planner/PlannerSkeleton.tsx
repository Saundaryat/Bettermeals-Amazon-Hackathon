import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function PlannerSkeleton() {
    return (
        <div className="w-full mt-6 space-y-8 animate-in fade-in duration-500">
            {/* 3 Meal Sections (Breakfast, Lunch, Dinner) */}
            {[1, 2, 3].map((mealIndex) => (
                <div key={mealIndex} className="space-y-4">
                    {/* Meal Section Header */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-32" />
                    </div>

                    {/* Meal Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((cardIndex) => (
                            <div key={cardIndex} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                                <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
                                <div className="space-y-3 flex-1 py-1">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-5 w-24 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
