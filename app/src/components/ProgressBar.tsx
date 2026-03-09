import React from "react";

interface ProgressBarProps {
  step: number;
  total: number;
}

const stepLabels = [
  "Meal Plan",
  "Grocery List",
  "Success"
];

export default function ProgressBar({ step, total }: ProgressBarProps) {
  const percent = ((step - 1) / (total - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center px-4 sm:px-6">
      {/* Progress Bar Container */}
      <div className="w-full h-3 sm:h-2 bg-leafgreen-50 rounded-full overflow-hidden relative">
        <div
          className="h-3 sm:h-2 bg-leafgreen-400 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      
      {/* Step Labels */}
      <div className="flex justify-between w-full mt-4 sm:mt-3 text-sm sm:text-xs font-semibold text-leafgreen-700 uppercase tracking-wider">
        {stepLabels.map((label, i) => (
          <span 
            key={label} 
            className={`
              transition-opacity duration-300
              ${i + 1 > step ? "opacity-30" : "opacity-100"}
              ${i === 0 ? "text-left" : i === stepLabels.length - 1 ? "text-right" : "text-center"}
              flex-1 px-2 sm:px-1
              leading-tight
            `}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
