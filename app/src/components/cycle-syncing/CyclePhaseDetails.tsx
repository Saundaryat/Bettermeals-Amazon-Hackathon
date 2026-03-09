import React from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sprout, Star, Home } from 'lucide-react';
import { CycleSyncingStyles } from './CycleSyncing.styles';

interface CyclePhaseDetailsProps {
    activePhase: string | null;
}

const PHASE_DETAILS: Record<string, { title: string; mood: string; focus: string; nutrition: string }> = {
    menstrual: {
        title: "Rest & Restore",
        mood: "Low energy, introspective.",
        focus: "Gentle movement, nourish with warmth.",
        nutrition: "Iron & Vitamin C (Spinach, Salmon)."
    },
    follicular: {
        title: "Rise & Shine",
        mood: "Rising energy, creative & social.",
        focus: "Explore new activities, light cardio.",
        nutrition: "Protein & B Vitamins (Avocado, Eggs)."
    },
    ovulation: {
        title: "Peak Power",
        mood: "Maximum energy, confident.",
        focus: "Connect, express yourself, socialize.",
        nutrition: "Calcium & Fiber (Quinoa, Veggies)."
    },
    luteal: {
        title: "Introspection & Care",
        mood: "Energy dips, turning inward.",
        focus: "Cozy comfort, creative work.",
        nutrition: "Complex Carbs (Sweet potato, Chickpeas)."
    }
};

export const CyclePhaseDetails = ({ activePhase }: CyclePhaseDetailsProps) => {
    if (!activePhase) return null;

    const details = PHASE_DETAILS[activePhase];
    if (!details) return null;

    return (
        <div className={cn(CycleSyncingStyles.detailsCard.container, "animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col gap-2 items-start w-[90%] max-w-[340px] md:max-w-[450px] p-3 md:p-4")}>
            <div className="flex items-center gap-2 w-full">
                <div className={cn(
                    CycleSyncingStyles.detailsCard.iconWrapper,
                    "w-8 h-8 md:w-10 md:h-10", // Smaller icon wrapper
                    activePhase === 'menstrual' && "bg-[#F5D0D0]/20",
                    activePhase === 'follicular' && "bg-[#D9EBD5]/20",
                    activePhase === 'ovulation' && "bg-[#CFE5E8]/20",
                    activePhase === 'luteal' && "bg-[#DCD6E8]/20",
                )}>
                    {activePhase === 'menstrual' && <Moon className={cn(CycleSyncingStyles.detailsCard.icon, "text-[#C45E5E] w-4 h-4 md:w-5 md:h-5")} />}
                    {activePhase === 'follicular' && <Sprout className={cn(CycleSyncingStyles.detailsCard.icon, "text-[#5F8856] w-4 h-4 md:w-5 md:h-5")} />}
                    {activePhase === 'ovulation' && <Star className={cn(CycleSyncingStyles.detailsCard.icon, "text-[#4A7A82] w-4 h-4 md:w-5 md:h-5")} />}
                    {activePhase === 'luteal' && <Home className={cn(CycleSyncingStyles.detailsCard.icon, "text-[#523E75] w-4 h-4 md:w-5 md:h-5")} />}
                </div>
                <h3 className={cn(CycleSyncingStyles.headings.h3Card, "text-sm md:text-base")}>{details.title}</h3>
            </div>

            <div className="w-full space-y-1.5 pl-1">
                <div className="grid grid-cols-[50px_1fr] gap-2 text-left">
                    <span className="text-[9px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">Mood</span>
                    <span className="text-[11px] md:text-sm text-gray-700 font-medium leading-tight">{details.mood}</span>
                </div>
                <div className="grid grid-cols-[50px_1fr] gap-2 text-left">
                    <span className="text-[9px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">Focus</span>
                    <span className="text-[11px] md:text-sm text-gray-700 font-medium leading-tight">{details.focus}</span>
                </div>
                <div className="grid grid-cols-[50px_1fr] gap-2 text-left">
                    <span className="text-[9px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider leading-tight">Eat</span>
                    <span className="text-[11px] md:text-sm text-gray-700 font-medium leading-tight">{details.nutrition}</span>
                </div>
            </div>
        </div>
    );
};
