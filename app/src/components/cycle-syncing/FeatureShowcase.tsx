import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CycleSyncingStyles } from './CycleSyncing.styles';

export const FeatureShowcase = () => {
    const [featureIndex, setFeatureIndex] = useState(0);

    const features = [
        {
            title: "Meal Planning",
            img: "/app/images/cyclesyncing/feature_meal_plan.webp"
        },
        {
            title: "Automated Grocery Lists",
            img: "/app/images/cyclesyncing/feature_grocery.webp"
        },
        {
            title: "WhatsApp Daily & Weekly Reminders",
            img: "/app/images/cyclesyncing/feature_whatsapp.webp"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setFeatureIndex((prev) => (prev + 1) % features.length);
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={CycleSyncingStyles.featureShowcase.container}>
            {/* Image Container */}
            <div className={CycleSyncingStyles.featureShowcase.imageContainer}> {/* Fixed size for stability */}
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className={cn(CycleSyncingStyles.featureShowcase.imageWrapper(idx === featureIndex))}
                    >
                        <img
                            src={feature.img}
                            alt={feature.title}
                            className={CycleSyncingStyles.featureShowcase.image}
                            loading="eager"
                        />
                    </div>
                ))}
            </div>

            {/* Text and Dots */}
            <div className={CycleSyncingStyles.featureShowcase.textContainer}>
                <h3 className={CycleSyncingStyles.headings.h3Title}>
                    {features[featureIndex].title}
                </h3>

                <div className={CycleSyncingStyles.featureShowcase.dotsContainer}>
                    {features.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(CycleSyncingStyles.featureShowcase.dot(idx === featureIndex))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
