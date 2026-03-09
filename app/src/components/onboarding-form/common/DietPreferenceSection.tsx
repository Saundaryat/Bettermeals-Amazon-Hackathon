import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DietPreferenceSectionProps {
    selectedDiet: string;
    onDietChange: (value: string) => void;
}

export default function DietPreferenceSection({
    selectedDiet,
    onDietChange
}: DietPreferenceSectionProps) {
    const dietOptions = [
        {
            id: 'no-restrictions',
            title: 'No Restrictions',
            description: 'Everything',
            icon: '/app/images/diet-icons/no-restrictions.webp'
        },
        {
            id: 'vegetarian',
            title: 'Vegetarian',
            description: 'No meat',
            icon: '/app/images/diet-icons/vegetarian.webp'
        },
        {
            id: 'eggetarian',
            title: 'Eggetarian',
            description: 'Veg + Eggs',
            icon: '/app/images/diet-icons/eggetarian.webp'
        },
        {
            id: 'non-vegetarian',
            title: 'Non-Veg',
            description: 'Meat & eggs',
            icon: '/app/images/diet-icons/non-vegetarian.webp'
        },
        {
            id: 'vegan',
            title: 'Vegan',
            description: 'Plant-based',
            icon: '/app/images/diet-icons/vegetarian.webp'
        },
        {
            id: 'jain',
            title: 'Jain',
            description: 'No root veg',
            icon: '/app/images/diet-icons/vegetarian.webp'
        }
    ];

    return (
        <div className="mt-6 max-w-2xl">
            <Label className="text-lg font-semibold text-gray-900 mb-2 block text-left">
                What do you like to eat? *
            </Label>
            <p className="text-gray-500 text-xs mb-4 text-left">
                Choose from a primary diet type. You can exclude specific foods in the next step.
            </p>

            <RadioGroup
                value={selectedDiet}
                onValueChange={onDietChange}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
                {dietOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`flex flex-col items-center p-3 border rounded-xl transition-all cursor-pointer text-center h-full ${selectedDiet === option.id
                            ? 'border-green-600 bg-green-50/50 ring-1 ring-green-600'
                            : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                            }`}
                        onClick={() => onDietChange(option.id)}
                    >
                        <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                        <div className="mb-2 flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24">
                            <img
                                src={option.icon}
                                alt={option.title}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/app/placeholder.svg';
                                }}
                            />
                        </div>
                        <Label htmlFor={option.id} className="font-bold text-gray-900 text-sm mb-0.5 cursor-pointer leading-tight">
                            {option.title}
                        </Label>
                        <p className="text-[10px] text-gray-500 leading-tight">
                            {option.description}
                        </p>
                    </div>
                ))}
            </RadioGroup>

            <p className="text-[10px] text-gray-400 mt-3 text-left">
                Don't see your preference? Choose "No Restrictions" and customize later.
            </p>
        </div>
    );
}
