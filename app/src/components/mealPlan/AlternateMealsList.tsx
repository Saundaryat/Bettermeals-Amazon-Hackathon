import React from "react";

interface AlternateMealsListProps {
  alternates: any[];
  onSelect: (selectedId: string) => void;
}

const AlternateMealsList: React.FC<AlternateMealsListProps> = ({ alternates, onSelect }) => {
  if (!alternates || alternates.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-1 text-peach-200">Alternate Meals</h4>
      <div className="grid grid-cols-2 gap-3">
        {alternates.map((alt: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => onSelect(alt.meal_id || alt.addon_id)}
          >
            <img
              src={alt.media?.image_url || alt.image_url || "/images/dish-placeholder.png"}
              alt={alt.dish_name}
              className="w-full h-24 object-cover rounded-lg border border-white/5"
            />
            <span className="text-xs mt-1">{alt.dish_name || alt.addon_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlternateMealsList; 