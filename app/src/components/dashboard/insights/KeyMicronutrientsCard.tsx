import React from 'react';
import {
    Sparkles, Carrot, Citrus, Milk, Sun, Leaf, Wheat,
    Drumstick, Banana, Beef, Nut, Shell, Waves,
    Fish, Triangle
} from 'lucide-react';
import { MicronutrientData } from '@/services/insightsTypes'; // Assuming MicronutrientData is exported there, checking original file... it uses dayData.key_micronutrients which is an array of objects.

// Defining the type based on usage in WeeklyInsights.tsx if not explicitly exported, but it seems it is part of WeeklyInsightsData.
// Let's import the type if possible. The original file imported { WeeklyInsightsData, MacroData }.
// I'll check if MicronutrientData is exported or I'll define a local interface for the props.

interface KeyMicronutrientsCardProps {
    key_micronutrients: {
        nutrient: string;
        daily_total: number;
        unit: string;
        mechanism_of_action: string;
    }[];
}

export const KeyMicronutrientsCard: React.FC<KeyMicronutrientsCardProps> = ({ key_micronutrients }) => {

    const getMicronutrientIcon = (name: string) => {
        const lowerName = name.toLowerCase();

        // Vitamins
        if (lowerName.includes('vitamin a')) return Carrot;
        if (lowerName.includes('vitamin c')) return Citrus;
        if (lowerName.includes('vitamin d')) return Milk;
        if (lowerName.includes('vitamin e')) return Sun; // Sunflower seed/flower -> Sun as proxy
        if (lowerName.includes('vitamin k')) return Leaf;
        if (lowerName.includes('vitamin b1') || lowerName.includes('thiamin')) return Wheat;
        if (lowerName.includes('vitamin b2') || lowerName.includes('riboflavin')) return Milk;
        if (lowerName.includes('vitamin b3') || lowerName.includes('niacin')) return Drumstick;
        if (lowerName.includes('vitamin b6')) return Banana;
        if (lowerName.includes('vitamin b9') || lowerName.includes('folate')) return Leaf;
        if (lowerName.includes('vitamin b12')) return Beef; // Steak/Meat -> Beef/Utensils

        // Minerals
        if (lowerName.includes('calcium')) return Milk; // Cheese/Milk -> Milk
        if (lowerName.includes('magnesium')) return Nut;
        if (lowerName.includes('iron')) return Beef; // Red meat/lentil -> Beef as proxy
        if (lowerName.includes('zinc')) return Shell; // Oyster/Seeds -> Shell
        if (lowerName.includes('iodine')) return Waves; // Seaweed -> Waves
        if (lowerName.includes('selenium')) return Nut; // Brazil nut -> Nut
        if (lowerName.includes('potassium')) return Banana;
        if (lowerName.includes('sodium')) return Triangle; // Salt crystals -> Triangle as abstract

        // Fats & Fiber
        if (lowerName.includes('omega-3')) return Fish;
        if (lowerName.includes('soluble fiber')) return Wheat; // Oats -> Wheat
        if (lowerName.includes('insoluble fiber')) return Wheat; // Whole grain -> Wheat
        if (lowerName.includes('fiber')) return Wheat;

        return Sparkles; // Default fallback
    };

    return (
        <div className="bg-white rounded-xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7e6cf]">
                    <Sparkles className="w-4 h-4 text-[#51754f]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Key Micronutrients</h3>
            </div>

            <ul className="space-y-6 relative z-10">
                {(key_micronutrients || []).map((item) => {
                    const Icon = getMicronutrientIcon(item.nutrient);
                    return (
                        <li key={item.nutrient} className="flex items-start text-gray-700">
                            <div className="mt-1 mr-4 flex-shrink-0 w-10 h-10 rounded-full bg-[#f3f4f4]/30 border border-[#f3f4f4]/60 shadow-sm flex items-center justify-center">
                                <Icon className="w-5 h-5 text-[#51754f]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-lg">{item.daily_total}{item.unit} {item.nutrient}</span>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">{item.mechanism_of_action}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
