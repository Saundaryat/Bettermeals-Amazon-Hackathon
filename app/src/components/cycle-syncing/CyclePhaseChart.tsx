import React from 'react';
import { cn } from '@/lib/utils';
import { CycleSyncingStyles } from './CycleSyncing.styles';

interface CyclePhaseChartProps {
    activePhase: string | null;
    onPhaseChange: (phase: string) => void;
}

export const CyclePhaseChart = ({ activePhase, onPhaseChange }: CyclePhaseChartProps) => {
    // If no phase is selected, all backgrounds should be somewhat visible but softer to invite clicking
    // Or we can make them all full opacity to look like a complete cycle.
    // Let's go with full opacity for all if none is selected, to show the "whole".
    const getOpacity = (phase: string) => {
        if (!activePhase) return "1"; // All visible initially
        return activePhase === phase ? "1" : "0.3"; // Spotlight effect
    };

    return (
        <div className={CycleSyncingStyles.cycleChart.container}>
            {/* SVG Background: Arcs & Hormone Curves */}
            <svg viewBox="0 0 360 220" className="w-full h-full overflow-visible">
                <defs>
                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="menstrualGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF5F5" />
                        <stop offset="100%" stopColor="#FDE8E8" />
                    </linearGradient>
                    <linearGradient id="follicularGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F6FFF9" />
                        <stop offset="100%" stopColor="#DCFCE7" />
                    </linearGradient>
                    <linearGradient id="ovulationGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F0F9FF" />
                        <stop offset="100%" stopColor="#E0F2FE" />
                    </linearGradient>
                    <linearGradient id="lutealGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FAF5FF" />
                        <stop offset="100%" stopColor="#F3E8FF" />
                    </linearGradient>
                </defs>

                {/* Sector Backgrounds (Approximated Arcs) */}
                {/* Menstrual (Left) */}
                <path
                    d="M 40,200 A 140,140 0 0,1 80,100 L 180,200 Z"
                    fill="url(#menstrualGradient)"
                    className="transition-all duration-500 cursor-pointer hover:opacity-100"
                    opacity={getOpacity('menstrual')}
                    onClick={() => onPhaseChange('menstrual')}
                />
                {/* Follicular (Top-Left) */}
                <path
                    d="M 80,100 A 140,140 0 0,1 160,60 L 180,200 Z"
                    fill="url(#follicularGradient)"
                    className="transition-all duration-500 cursor-pointer hover:opacity-100"
                    opacity={getOpacity('follicular')}
                    onClick={() => onPhaseChange('follicular')}
                />
                {/* Ovulation (Top-Center) */}
                <path
                    d="M 160,60 A 140,140 0 0,1 220,65 L 180,200 Z"
                    fill="url(#ovulationGradient)"
                    className="transition-all duration-500 cursor-pointer hover:opacity-100"
                    opacity={getOpacity('ovulation')}
                    onClick={() => onPhaseChange('ovulation')}
                />
                {/* Luteal (Right) */}
                <path
                    d="M 220,65 A 140,140 0 0,1 320,200 L 180,200 Z"
                    fill="url(#lutealGradient)"
                    className="transition-all duration-500 cursor-pointer hover:opacity-100"
                    opacity={getOpacity('luteal')}
                    onClick={() => onPhaseChange('luteal')}
                />

                {/* Separator Lines */}
                <path d="M 180,200 L 40,200" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 180,200 L 80,100" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 180,200 L 160,60" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 180,200 L 220,65" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 180,200 L 320,200" stroke="white" strokeWidth="2" strokeDasharray="4 2" />

                {/* Hormone Curves */}
                {/* Estrogen (Teal) */}
                <path
                    d="M 40,190 C 80,185 120,160 160,100 S 220,120 260,160 S 320,180 320,185"
                    fill="none"
                    stroke={CycleSyncingStyles.colors.estrogen}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-sm pointer-events-none"
                    filter="url(#softGlow)"
                />

                {/* Progesterone (Orange) */}
                <path
                    d="M 40,195 C 100,195 160,190 200,160 S 260,130 290,140 S 320,170 320,170"
                    fill="none"
                    stroke={CycleSyncingStyles.colors.progesterone}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-sm pointer-events-none"
                    filter="url(#softGlow)"
                />
            </svg>

            {/* Interactive Phase Items Positioned on Arc */}
            {/* Menstrual */}
            <div
                className={cn(CycleSyncingStyles.cycleChart.phaseItem, "left-[5%] bottom-[20%]")}
                onClick={() => onPhaseChange('menstrual')}
            >
                <div className={cn(CycleSyncingStyles.cycleChart.phaseImageWrapper(activePhase === 'menstrual' || activePhase === null))}>
                    <div className={cn(CycleSyncingStyles.cycleChart.phaseImageInner(activePhase === 'menstrual', CycleSyncingStyles.colors.menstrual.border, CycleSyncingStyles.colors.menstrual.bg))}>
                        <img src="/app/images/cyclesyncing/menstrual.webp" alt="Menstrual" className={CycleSyncingStyles.cycleChart.phaseImage} loading="eager" />
                    </div>
                </div>
                <span className={cn(CycleSyncingStyles.cycleChart.phaseLabel(activePhase === 'menstrual', CycleSyncingStyles.colors.menstrual.text))}>Menstrual</span>
                <span className={CycleSyncingStyles.cycleChart.phaseDays}>Days 1-5</span>
            </div>

            {/* Follicular */}
            <div
                className={cn(CycleSyncingStyles.cycleChart.phaseItem, "left-[25%] top-[15%]")}
                onClick={() => onPhaseChange('follicular')}
            >
                <div className={cn(CycleSyncingStyles.cycleChart.phaseImageWrapper(activePhase === 'follicular' || activePhase === null))}>
                    <div className={cn(CycleSyncingStyles.cycleChart.phaseImageInner(activePhase === 'follicular', CycleSyncingStyles.colors.follicular.border, CycleSyncingStyles.colors.follicular.bg))}>
                        <img src="/app/images/cyclesyncing/follicular.webp" alt="Follicular" className={CycleSyncingStyles.cycleChart.phaseImage} loading="eager" />
                    </div>
                </div>
                <span className={cn(CycleSyncingStyles.cycleChart.phaseLabel(activePhase === 'follicular', CycleSyncingStyles.colors.follicular.text))}>Follicular</span>
                <span className={CycleSyncingStyles.cycleChart.phaseDays}>Days 6-14</span>
            </div>

            {/* Ovulation */}
            <div
                className={cn(CycleSyncingStyles.cycleChart.phaseItem, "left-[55%] top-[5%]")}
                onClick={() => onPhaseChange('ovulation')}
            >
                <div className={cn(CycleSyncingStyles.cycleChart.phaseImageWrapper(activePhase === 'ovulation' || activePhase === null))}>
                    <div className={cn(CycleSyncingStyles.cycleChart.phaseImageInner(activePhase === 'ovulation', CycleSyncingStyles.colors.ovulation.border, CycleSyncingStyles.colors.ovulation.bg))}>
                        <img src="/app/images/cyclesyncing/ovulation.webp" alt="Ovulation" className={CycleSyncingStyles.cycleChart.phaseImage} loading="eager" />
                    </div>
                </div>
                <span className={cn(CycleSyncingStyles.cycleChart.phaseLabel(activePhase === 'ovulation', CycleSyncingStyles.colors.ovulation.text))}>Ovulation</span>
                <span className={CycleSyncingStyles.cycleChart.phaseDays}>Day 15</span>
            </div>

            {/* Luteal */}
            <div
                className={cn(CycleSyncingStyles.cycleChart.phaseItem, "right-[5%] bottom-[30%]")}
                onClick={() => onPhaseChange('luteal')}
            >
                <div className={cn(CycleSyncingStyles.cycleChart.phaseImageWrapper(activePhase === 'luteal' || activePhase === null))}>
                    <div className={cn(CycleSyncingStyles.cycleChart.phaseImageInner(activePhase === 'luteal', CycleSyncingStyles.colors.luteal.border, CycleSyncingStyles.colors.luteal.bg))}>
                        <img src="/app/images/cyclesyncing/luteal.webp" alt="Luteal" className={CycleSyncingStyles.cycleChart.phaseImage} loading="eager" />
                    </div>
                </div>
                <span className={cn(CycleSyncingStyles.cycleChart.phaseLabel(activePhase === 'luteal', CycleSyncingStyles.colors.luteal.text))}>Luteal</span>
                <span className={CycleSyncingStyles.cycleChart.phaseDays}>Days 16-28</span>
            </div>
        </div>
    );
};
