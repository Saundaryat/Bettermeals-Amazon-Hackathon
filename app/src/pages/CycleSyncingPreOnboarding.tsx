import React, { useEffect, useState } from 'react';
import { Activity, Utensils, Flame } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CycleSyncingStyles } from '@/components/cycle-syncing/CycleSyncing.styles';

// Import new components
import { FeatureShowcase } from '@/components/cycle-syncing/FeatureShowcase';
import { CycleHeader } from '@/components/cycle-syncing/CycleHeader';
import { BeforeAfterVisual } from '@/components/cycle-syncing/BeforeAfterVisual';
import { BenefitsList } from '@/components/cycle-syncing/BenefitsList';
import { CyclePhaseDetails } from '@/components/cycle-syncing/CyclePhaseDetails';
import CyclePhaseVisualizer from '@/components/cycle-syncing/CyclePhaseVisualizer'; // Imported new component

export default function CycleSyncingPreOnboarding() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [activePhase, setActivePhase] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const phoneNumber = searchParams.get('phone') || searchParams.get('mobile') || '';

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleNext = () => {
        if (!api) return;

        if (current === 3) {
            navigate('/registration?flow=simple', {
                state: {
                    whatsappNumber: phoneNumber
                }
            });
        } else {
            api.scrollNext();
        }
    };

    const getPageBackground = () => {
        switch (activePhase) {
            case 'menstrual': return `bg-[#F5D0D0]/20`;
            case 'follicular': return `bg-[#D9EBD5]/20`;
            case 'ovulation': return `bg-[#CFE5E8]/20`;
            case 'luteal': return `bg-[#DCD6E8]/20`;
            default: return 'bg-white';
        }
    };

    return (
        <div className={cn(CycleSyncingStyles.pageContainer.replace('bg-white', ''), getPageBackground(), "transition-colors duration-700")}>
            {/* Header */}
            <CycleHeader />

            {/* Main Content Area */}
            <div className={CycleSyncingStyles.mainContent}>
                <Carousel setApi={setApi} className={CycleSyncingStyles.carouselWrapper}>
                    <CarouselContent className={CycleSyncingStyles.carouselContent}>

                        {/* Slide 1: Intro Hook */}
                        <CarouselItem className={CycleSyncingStyles.carouselItemCentered}>
                            <div className="flex flex-col gap-2 md:mb-6 px-4 max-w-[340px] md:max-w-2xl mx-auto h-full justify-center items-center">
                                <h2 className="text-xl md:text-3xl font-bold text-[#2D3648] text-center leading-snug">
                                    Fed up with monthly mood swings and fatigue? You deserve to feel in control, not confused. Cycle syncing could change the game.
                                </h2>

                                <div className="w-full max-w-[200px] md:max-w-[320px] aspect-square relative mt-2 md:mt-4 mx-auto">
                                    <img
                                        src="/app/images/cyclesyncing/thinking_woman.png"
                                        alt="Thinking Woman"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 w-full max-w-[260px] md:max-w-[300px] mt-2 md:mt-4 mx-auto">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Activity className="w-5 h-5 text-gray-400 shrink-0" />
                                        <span className="text-sm md:text-base font-medium">Inconsistent energy</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Utensils className="w-5 h-5 text-gray-400 shrink-0" />
                                        <span className="text-sm md:text-base font-medium">Unexplained cravings</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Flame className="w-5 h-5 text-gray-400 shrink-0" />
                                        <span className="text-sm md:text-base font-medium">Bloating and inflammation</span>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>

                        {/* Slide 2: Chart & Definition */}
                        <CarouselItem className={cn(CycleSyncingStyles.carouselItemCentered, activePhase ? "justify-start pt-8 pb-4 transition-all duration-500 ease-in-out" : "justify-center duration-500 ease-in-out")}>
                            <h1 className="text-2xl font-bold text-[#2D3648] text-center mb-1">
                                What Is Cycle Syncing?
                            </h1>
                            <p className="text-sm text-gray-600 text-center max-w-[280px] mx-auto leading-tight mb-2">
                                Cycle syncing helps you support your body by matching food, movement, and lifestyle to each phase.
                            </p>

                            <p className="text-xs text-[#7FB6B2] font-medium animate-pulse mb-2 text-center">
                                Click on the different phases to know more
                            </p>

                            {/* Cycle Chart Container */}
                            <CyclePhaseVisualizer activePhase={activePhase} onPhaseChange={setActivePhase} />

                            {/* Legend Removed as per request */}

                            {/* Active Phase Card */}
                            <CyclePhaseDetails activePhase={activePhase} />
                        </CarouselItem>

                        {/* Slide 3: Why Eating With Your Cycle Matters */}
                        <CarouselItem className={CycleSyncingStyles.carouselItemPadded}>
                            <h1 className={CycleSyncingStyles.headings.h1Large}>
                                Why Eating With Your Cycle Matters
                            </h1>

                            {/* Main Visual: Before/After */}
                            <BeforeAfterVisual />

                            <BenefitsList />
                        </CarouselItem>

                        {/* Slide 4: How Bettermeals Helps */}
                        <CarouselItem className={CycleSyncingStyles.carouselItemPadded}>
                            <h1 className={CycleSyncingStyles.headings.h1Large}>
                                How Bettermeals Helps
                            </h1>
                            <p className={CycleSyncingStyles.text.bodySmall}>
                                Your cycle is unique, so your meal plan should be too.
                            </p>

                            {/* Feature Showcase Component */}
                            <FeatureShowcase />
                        </CarouselItem>

                    </CarouselContent>
                </Carousel>

                {/* Footer Area with Dots and Button */}
                <div className={CycleSyncingStyles.footer.container}>
                    <div className={CycleSyncingStyles.footer.dotsWrapper}>
                        {[0, 1, 2, 3].map((index) => (
                            <button
                                key={index}
                                className={cn(CycleSyncingStyles.footer.dot(current === index))}
                                onClick={() => api?.scrollTo(index)}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleNext}
                        className={CycleSyncingStyles.footer.button}
                    >
                        {current === 3 ? 'Get Started' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
