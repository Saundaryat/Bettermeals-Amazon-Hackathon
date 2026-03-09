import { useState } from 'react';

export type ViewMode = 'today' | 'weekly' | 'upcoming';

function getInitialViewMode(): ViewMode {
    if (typeof window === 'undefined') return 'weekly';
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    return (view === 'today' || view === 'weekly' || view === 'upcoming')
        ? (view as ViewMode)
        : 'weekly';
}

function getInitialDay(viewMode: ViewMode, initialDay?: number): number {
    if (initialDay !== undefined) return initialDay;
    if (viewMode === 'upcoming') return 0; // Monday

    // 0 is Monday, 6 is Sunday
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
}

export function usePlannerState(initialDay?: number) {
    const [viewMode, setViewMode] = useState<ViewMode>(() => getInitialViewMode());
    const [selectedDay, setSelectedDay] = useState(() => getInitialDay(viewMode, initialDay));

    const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
    const [selectedMealImage, setSelectedMealImage] = useState<string | undefined>(undefined);
    const [isMealDetailOpen, setIsMealDetailOpen] = useState(false);

    const [hasUserChangedView, setHasUserChangedView] = useState(false);
    const [hasUrlViewParam] = useState(() => {
        if (typeof window === 'undefined') return false;
        return new URLSearchParams(window.location.search).has('view');
    });

    const handleViewModeChange = (mode: ViewMode, isUserAction: boolean = true) => {
        if (isUserAction) {
            setHasUserChangedView(true);
        }
        setViewMode(mode);
        // Always reset the pointer to Monday when switching to the Next Week view
        if (mode === 'upcoming') {
            setSelectedDay(0);
        }
    };

    const handleDayChange = (dayIndex: number) => {
        setSelectedDay(dayIndex);
    };

    const handleMealClick = (mealId: string, imageUrl?: string) => {
        setSelectedMealId(mealId);
        setSelectedMealImage(imageUrl);
        setIsMealDetailOpen(true);
    };

    const handleCloseMealDetail = () => {
        setIsMealDetailOpen(false);
        setSelectedMealId(null);
        setSelectedMealImage(undefined);
    };

    return {
        viewMode,
        setViewMode: handleViewModeChange,
        hasUserChangedView,
        hasUrlViewParam,
        selectedDay,
        handleDayChange,
        selectedMealId,
        selectedMealImage,
        isMealDetailOpen,
        handleMealClick,
        handleCloseMealDetail,
        setIsMealDetailOpen // potentially needed for external control if any
    };
}
