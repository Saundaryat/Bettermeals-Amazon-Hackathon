import React from 'react';
import { Calendar, CalendarDays, CalendarClock } from 'lucide-react';

interface ViewModeToggleProps {
    viewMode: 'today' | 'weekly' | 'upcoming';
    setViewMode: (mode: 'today' | 'weekly' | 'upcoming') => void;
}

/**
 * Toggle component to switch between "Today", "Weekly" and "Upcoming" views.
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
    viewMode,
    setViewMode,
}) => {
    return (
        <div className="mb-6 lg:mb-8">
            <div className="flex space-x-2 bg-black/5 rounded-lg p-1 w-full lg:w-fit">
                <button
                    onClick={() => setViewMode('today')}
                    className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all ${viewMode === 'today'
                        ? 'bg-[#f7e6cf] text-black shadow-sm'
                        : 'text-black/70 hover:text-black hover:bg-black/10'
                        }`}
                >
                    <div className="flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2">
                        {/* <Calendar size={14} className="lg:w-4 lg:h-4" /> */}
                        <span className="hidden sm:inline">Today</span>
                        <span className="sm:hidden">Today</span>
                    </div>
                </button>
                <button
                    onClick={() => setViewMode('weekly')}
                    className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all ${viewMode === 'weekly'
                        ? 'bg-[#f7e6cf] text-black shadow-sm'
                        : 'text-black/70 hover:text-black hover:bg-black/10'
                        }`}
                >
                    <div className="flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2">
                        {/* <CalendarDays size={14} className="lg:w-4 lg:h-4" /> */}
                        <span className="hidden sm:inline">This Week</span>
                        <span className="sm:hidden">This Week</span>
                    </div>
                </button>
                <button
                    onClick={() => setViewMode('upcoming')}
                    className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all ${viewMode === 'upcoming'
                        ? 'bg-[#f7e6cf] text-black shadow-sm'
                        : 'text-black/70 hover:text-black hover:bg-black/10'
                        }`}
                >
                    <div className="flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2">
                        {/* <CalendarClock size={14} className="lg:w-4 lg:h-4" /> */}
                        <span className="hidden sm:inline">Next Week</span>
                        <span className="sm:hidden">Next Week</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
