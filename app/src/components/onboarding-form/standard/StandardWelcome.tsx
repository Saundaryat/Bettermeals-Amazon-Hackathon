import React from 'react';
import { COMMON_CLASSES } from '../common/styles';

interface StandardWelcomeProps {
    onNext: () => void;
}

export default function StandardWelcome({ onNext }: StandardWelcomeProps) {
    const onboardingSteps = [
        {
            icon: "/app/images/onboarding/household.webp",
            title: "Your Household",
            subtitle: "Who are we feeding?",
        },
        {
            icon: "/app/images/onboarding/family.webp",
            title: "What's on the Table",
            subtitle: "Dietary needs and preferences",
        }
    ];

    return (
        <div className={COMMON_CLASSES.onboardingContainer}>
            <div className={COMMON_CLASSES.centeredContent}>
                {/* Title */}
                <div className={COMMON_CLASSES.headingContainer}>
                    <h1 className={COMMON_CLASSES.pageTitle}>Set up your account</h1>
                    <p className={COMMON_CLASSES.pageSubtitle}>
                        In just a few minutes, you'll have a weekly meal plan ready for your home. We just need a few details to get started.
                    </p>
                </div>

                {/* Onboarding Steps */}
                <div className="space-y-4 mb-6">
                    {onboardingSteps.map((step, index) => (
                        <div key={index} className="bg-[#FFF9F0] rounded-3xl p-4 shadow-sm border border-gray-100/50">
                            <div className="flex items-center gap-5">
                                {/* Step Badge and Icon */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-[#7A9B76] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                                        Step {index + 1}
                                    </div>
                                    {/* Icon */}
                                    <img
                                        src={step.icon}
                                        alt={step.title}
                                        className="w-20 h-20 rounded-full object-cover shadow-sm"
                                        loading="eager"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#2D332D] mb-0.5">
                                        {step.title}
                                    </h3>
                                    <h4 className="text-base text-[#6B756B] font-medium leading-tight">
                                        {step.subtitle}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
