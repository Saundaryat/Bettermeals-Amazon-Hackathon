import React from "react";

interface Macros {
  fiber?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

interface DishDetailsProps {
  dish: {
    meal_id: string;
    dish_name: string;
    meal_type?: string;
    pre_process?: string;
    nutrition?: string;
    recipe?: string;
    why?: string;
    macros?: Macros;
    notes?: string;
    ingredients?: string;
    image_url?: string;
  };
  imageUrl?: string;
}

const DishDetails: React.FC<DishDetailsProps> = ({ dish, imageUrl }) => {
  const renderMacros = (macros?: Macros) => {
    if (!macros) return null;
    const entries = Object.entries(macros).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return null;
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-2 pt-2 border-t border-white/10">
        {entries.map(([key, value]) => (
          <span key={key} className="flex justify-between">
            <span className="capitalize text-muted-foreground">{key}</span>
            <span className="font-semibold">{value}</span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
          <img
            src={imageUrl || dish.image_url || "/images/dish-placeholder.png"}
            alt={dish.dish_name}
            className="w-full h-full object-cover"
            style={{ borderRadius: '50%' }}
          />
        </div>
      </div>
      {/* Why / Description */}
      {(dish.nutrition || dish.notes) && (
        <div>
          <h4 className="font-semibold mb-1 text-peach-200">Why you'll love it</h4>
          <p className="text-sm leading-relaxed">{dish.nutrition || dish.notes}</p>
        </div>
      )}

      {/* Ingredients */}
      {dish.ingredients && (
        <div>
          <h4 className="font-semibold mb-1 text-peach-200">Ingredients</h4>
          <p className="text-sm leading-relaxed">{dish.ingredients}</p>
        </div>
      )}

      {/* Recipe / Instructions */}
      {dish.recipe && (
        <div>
          <h4 className="font-semibold mb-1 text-peach-200">Recipe</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed">{dish.recipe}</p>
        </div>
      )}

      {/* Macros breakdown */}
      {renderMacros(dish.macros)}
    </div>
  );
};

export default DishDetails; 