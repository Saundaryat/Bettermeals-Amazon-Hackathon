import React from 'react';

interface OnboardingStepCardProps {
    icon: string;
    title: string;
    subtitle: string;
    stepNumber: number;
}

export const OnboardingStepCard: React.FC<OnboardingStepCardProps> = ({
    icon,
    title,
    subtitle,
    stepNumber
}) => {
    return (
        <div className="bg-[#FFF9F0] rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm border border-gray-100/50">
            <div className="flex items-center gap-3 md:gap-5">
                <div className="flex flex-col items-center gap-1 md:gap-2">
                    <div className="bg-[#7A9B76] text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 rounded-full uppercase tracking-tighter">
                        Step {stepNumber}
                    </div>
                    <img
                        src={icon}
                        alt={title}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover shadow-sm"
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-[#2D332D] mb-0.5">
                        {title}
                    </h3>
                    <h4 className="text-sm md:text-base text-[#6B756B] font-medium leading-tight">
                        {subtitle}
                    </h4>
                </div>
            </div>
        </div>
    );
};
