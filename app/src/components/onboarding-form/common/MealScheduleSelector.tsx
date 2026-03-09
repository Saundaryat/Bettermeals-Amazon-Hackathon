import React from 'react';
import { OnboardingMealSchedule as MealSchedule } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { COMMON_CLASSES } from './styles';

interface MealScheduleSelectorProps {
    memberId: string;
    schedule: MealSchedule;
    onChange: (newSchedule: MealSchedule) => void;
}

export default function MealScheduleSelector({
    memberId,
    schedule,
    onChange
}: MealScheduleSelectorProps) {

    const toggleMealSchedule = (day: keyof MealSchedule, meal: 'breakfast' | 'lunch' | 'dinner') => {
        const newSchedule = {
            ...schedule,
            [day]: {
                ...schedule[day],
                [meal]: !schedule[day][meal]
            }
        };
        onChange(newSchedule);
    };

    const selectAllMeals = () => {
        const allSelectedSchedule: MealSchedule = {
            monday: { breakfast: true, lunch: true, dinner: true },
            tuesday: { breakfast: true, lunch: true, dinner: true },
            wednesday: { breakfast: true, lunch: true, dinner: true },
            thursday: { breakfast: true, lunch: true, dinner: true },
            friday: { breakfast: true, lunch: true, dinner: true },
            saturday: { breakfast: true, lunch: true, dinner: true },
            sunday: { breakfast: true, lunch: true, dinner: true }
        };
        onChange(allSelectedSchedule);
    };

    const clearAllMeals = () => {
        const allClearedSchedule: MealSchedule = {
            monday: { breakfast: false, lunch: false, dinner: false },
            tuesday: { breakfast: false, lunch: false, dinner: false },
            wednesday: { breakfast: false, lunch: false, dinner: false },
            thursday: { breakfast: false, lunch: false, dinner: false },
            friday: { breakfast: false, lunch: false, dinner: false },
            saturday: { breakfast: false, lunch: false, dinner: false },
            sunday: { breakfast: false, lunch: false, dinner: false }
        };
        onChange(allClearedSchedule);
    };

    return (
        <div className="mb-6">
            <Label className={COMMON_CLASSES.labelSmall}>
                Meal Schedule *
            </Label>
            <p className="text-sm text-gray-600 mb-4">
                Select which meals you'll be eating at home for each day of the week.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700 text-sm">Day</th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 text-sm">
                                <span className="md:hidden">B</span>
                                <span className="hidden md:inline">Breakfast</span>
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 text-sm">
                                <span className="md:hidden">L</span>
                                <span className="hidden md:inline">Lunch</span>
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 text-sm">
                                <span className="md:hidden">D</span>
                                <span className="hidden md:inline">Dinner</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Object.entries(schedule) as [keyof MealSchedule, { breakfast: boolean; lunch: boolean; dinner: boolean }][]).map(([day, meals]) => (
                            <tr key={day} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-3 py-2 font-medium text-gray-700 capitalize text-sm">
                                    {day}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                    <Checkbox
                                        id={`${memberId}-${day}-breakfast`}
                                        checked={meals.breakfast}
                                        onCheckedChange={() => toggleMealSchedule(day, 'breakfast')}
                                    />
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                    <Checkbox
                                        id={`${memberId}-${day}-lunch`}
                                        checked={meals.lunch}
                                        onCheckedChange={() => toggleMealSchedule(day, 'lunch')}
                                    />
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                    <Checkbox
                                        id={`${memberId}-${day}-dinner`}
                                        checked={meals.dinner}
                                        onCheckedChange={() => toggleMealSchedule(day, 'dinner')}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 mt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllMeals}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                >
                    Select All Meals
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearAllMeals}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                    Clear All
                </Button>
            </div>
        </div>
    );
}
