import { useState, useEffect, useMemo } from 'react';
import { differenceInDays, isValid } from 'date-fns';

export interface CycleData {
    lastPeriodDate: Date | undefined;
    cycleLength: number;
    cycleGoal: string[];
    calculatedPhase: string;
}

export const useCycleSyncing = (initialData?: Partial<CycleData>) => {
    const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(initialData?.lastPeriodDate);
    const [cycleLength, setCycleLength] = useState<number>(Number(initialData?.cycleLength) || 4);
    const [cycleGoal, setCycleGoal] = useState<string[]>(
        Array.isArray(initialData?.cycleGoal) ? initialData.cycleGoal : initialData?.cycleGoal ? [initialData.cycleGoal as unknown as string] : []
    );
    const [calculatedPhase, setCalculatedPhase] = useState<string>(initialData?.calculatedPhase || "");

    useEffect(() => {
        if (!lastPeriodDate || !isValid(lastPeriodDate)) {
            setCalculatedPhase("");
            return;
        }

        const today = new Date();
        const daysDiff = differenceInDays(today, lastPeriodDate);

        if (daysDiff < 0) {
            setCalculatedPhase("Wait... future date?");
            return;
        }

        // Mapping droplets to actual average cycle lengths
        let avgCycle = 28;
        const cycleMapping: Record<number, number> = {
            1: 25,
            2: 26,
            3: 27,
            4: 28,
            5: 30,
            6: 32,
            7: 35
        };
        avgCycle = cycleMapping[cycleLength] || 28;

        let currentCycleDay = (daysDiff % avgCycle) + 1;
        if (currentCycleDay > avgCycle) {
            currentCycleDay = 1;
        }

        const ovulationDay = avgCycle - 14;

        let phase = "";
        if (currentCycleDay <= 7) {
            phase = "MENSTRUAL PHASE";
        } else if (currentCycleDay < ovulationDay) {
            phase = "FOLLICULAR PHASE";
        } else if (currentCycleDay === ovulationDay) {
            phase = "OVULATORY PHASE";
        } else {
            phase = "LUTEAL PHASE";
        }

        setCalculatedPhase(phase);
    }, [lastPeriodDate, cycleLength]);

    const handleGoalToggle = (option: string) => {
        if (option === "All of above") {
            setCycleGoal(prev => prev.includes("All of above") ? [] : ["All of above"]);
        } else {
            setCycleGoal(prev => {
                const filtered = prev.filter(g => g !== "All of above");
                if (filtered.includes(option)) {
                    return filtered.filter(g => g !== option);
                } else {
                    return [...filtered, option];
                }
            });
        }
    };

    const cycleData = useMemo(() => ({
        lastPeriodDate,
        cycleLength,
        cycleGoal,
        calculatedPhase
    }), [lastPeriodDate, cycleLength, cycleGoal, calculatedPhase]);

    return {
        lastPeriodDate,
        setLastPeriodDate,
        cycleLength,
        setCycleLength,
        cycleGoal,
        handleGoalToggle,
        calculatedPhase,
        cycleData
    };
};
