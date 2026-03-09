import React, { useEffect } from 'react';
import { Pill, Zap, Smile, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMON_CLASSES } from '../common/styles';
import { useCycleSyncing, CycleData } from './hooks/useCycleSyncing';
import { CycleCalendar } from './components/CycleCalendar';
import { CycleLengthSelector } from './components/CycleLengthSelector';
import { GoalSelector } from './components/GoalSelector';

interface CycleSyncingAboutYouProps {
    onNext: (data: CycleData) => void;
    onPrevious?: () => void;
    showPrevious?: boolean;
    data?: Partial<CycleData>;
    onDataChange: (data: CycleData) => void;
}

const GOAL_OPTIONS = [
    { label: "Pain relief", icon: <Pill /> },
    { label: "Better mood", icon: <Smile /> },
    { label: "Steady energy", icon: <Zap /> },
    { label: "All of above", icon: <Star /> }
];

export default function CycleSyncingAboutYou({
    onNext,
    onPrevious,
    showPrevious = false,
    data,
    onDataChange
}: CycleSyncingAboutYouProps) {
    const {
        lastPeriodDate,
        setLastPeriodDate,
        cycleLength,
        setCycleLength,
        cycleGoal,
        handleGoalToggle,
        calculatedPhase,
        cycleData
    } = useCycleSyncing(data);

    // Sync data changes back to parent
    const onDataChangeRef = React.useRef(onDataChange);

    useEffect(() => {
        onDataChangeRef.current = onDataChange;
    });

    useEffect(() => {
        onDataChangeRef.current(cycleData);
    }, [cycleData]);

    return (
        <div className={cn(COMMON_CLASSES.contentContainer, "py-6")}>
            <div className={COMMON_CLASSES.centeredContent}>
                <div className={COMMON_CLASSES.headingContainer}>
                    <h1 className={COMMON_CLASSES.sectionTitle}>
                        Your Cycle
                    </h1>
                </div>

                <div className="w-full space-y-4">
                    {/* Question 1: Date Picker */}
                    <div className="space-y-3">
                        <label className={COMMON_CLASSES.label}>
                            When did your last period start?
                        </label>
                        <CycleCalendar
                            selectedDate={lastPeriodDate}
                            onDateSelect={setLastPeriodDate}
                            calculatedPhase={calculatedPhase}
                        />
                    </div>

                    {/* Question 2: Duration */}
                    <div className="space-y-3">
                        <label className={COMMON_CLASSES.label}>
                            How long is your typical cycle?
                        </label>
                        <p className={COMMON_CLASSES.description}>
                            Select based on your cycle length: DAY 1-3 (shorter cycles), DAY 4 (average), DAY 5-7 (longer cycles)
                        </p>
                        <CycleLengthSelector
                            currentLength={cycleLength}
                            onLengthChange={setCycleLength}
                        />
                    </div>

                    {/* Question 3: Goals */}
                    <div className="space-y-2">
                        <label className={COMMON_CLASSES.label}>
                            What's your #1 goal with cycle syncing?
                        </label>
                        <p className="text-[#6B756B] text-sm font-medium mb-3">
                            Pick one or more—this shapes your meal plan focus.
                        </p>
                        <GoalSelector
                            selectedGoals={cycleGoal}
                            onGoalToggle={handleGoalToggle}
                            options={GOAL_OPTIONS}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
