import React from 'react';
import { COMMON_CLASSES } from './styles';

interface OnboardingWelcomeProps {
    onNext: () => void;
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
    return (
        <div className={`${COMMON_CLASSES.onboardingContainer} flex items-center justify-center p-4 md:p-8 min-h-[80vh]`}>
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center mx-auto">
                    {/* Title */}
                    <div className="flex flex-col items-center space-y-4 mb-8">
                        <h1 className={`${COMMON_CLASSES.pageTitle} text-3xl md:text-4xl font-bold text-gray-900 tracking-tight animate-in fade-in duration-700`}>
                            Set up your account
                        </h1>
                        <p className={`${COMMON_CLASSES.pageSubtitle} text-gray-600 text-lg md:text-xl max-w-lg mx-auto leading-relaxed animate-in fade-in duration-700 delay-150`}>
                            In just a few minutes, you'll have a weekly meal plan ready for your home. We just need a few details to get started.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
