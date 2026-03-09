import React, { useState } from 'react';
import cycleLady from '@/assets/cycle-lady.png';
import { Leaf, Moon, Star, Droplets, Home } from 'lucide-react'; // Fallback icons

// You can replace these with your actual SVGs if you have them
const PhaseIcon = ({ phase, isActive }: { phase: string; isActive: boolean }) => {
    const iconSize = 24;
    const color = isActive ? 'white' : 'curretColor';

    switch (phase) {
        case 'Menstrual':
            return <Droplets size={iconSize} className={isActive ? 'text-white' : 'text-[#E58C8C]'} />;
        case 'Follicular':
            return <Leaf size={iconSize} className={isActive ? 'text-white' : 'text-[#96C08D]'} />;
        case 'Ovulation':
            return <Star size={iconSize} className={isActive ? 'text-white' : 'text-[#7FB6B2]'} />;
        case 'Luteal':
            return <Home size={iconSize} className={isActive ? 'text-white' : 'text-[#B49AB6]'} />;
        default:
            return null;
    }
};

const phases = [
    { name: 'Menstrual', label: 'Menstrual', days: 'Days 1-5', color: '#F2C4C4', activeColor: '#E58C8C', startAngle: 0, endAngle: 90 }, // Example angles
    { name: 'Follicular', label: 'Follicular', days: 'Days 6-14', color: '#D4EAD6', activeColor: '#96C08D', startAngle: 90, endAngle: 180 },
    { name: 'Ovulation', label: 'Ovulation', days: 'Day 15', color: '#CBEBE8', activeColor: '#7FB6B2', startAngle: 180, endAngle: 240 },
    { name: 'Luteal', label: 'Luteal', days: 'Days 16-28', color: '#E4D9E6', activeColor: '#B49AB6', startAngle: 240, endAngle: 360 },
];

export default function CyclePhaseVisualizer() {
    const [activePhase, setActivePhase] = useState<string | null>(null);

    // Helper to calculate path for arc
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    // Helper to get center of arc for icon placement
    const getArcCenter = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        return polarToCartesian(centerX, centerY, radius, midAngle);
    };

    const size = 300;
    const center = size / 2;
    const radius = 120;
    const strokeWidth = 50;
    const innerRadius = radius - strokeWidth / 2; // For placing lady inside
    const iconRadius = radius; // Place icons on the ring

    return (
        <div className="flex flex-col items-center justify-center relative w-full max-w-[340px] mx-auto aspect-square">
            <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {phases.map((phase, index) => {
                    const d = describeArc(center, center, radius, phase.startAngle, phase.endAngle);
                    const isActive = activePhase === phase.name;
                    
                    // Arc Path (Thick stroke)
                    return (
                        <g key={phase.name} 
                           className="cursor-pointer transition-all duration-300 hover:opacity-90"
                           onClick={() => setActivePhase(phase.name === activePhase ? null : phase.name)}
                           onMouseEnter={() => setActivePhase(phase.name)}
                           onMouseLeave={() => setActivePhase(null)}
                        >
                            <path
                                d={d}
                                fill="none"
                                stroke={isActive ? phase.activeColor : phase.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="butt" // Changed to butt for seamless circle
                                className="transition-colors duration-300 ease-in-out"
                            />
                        </g>
                    );
                })}

                {/* Dashed separators (Optional, if needed for "Donut" look) */}
                
            </svg>

            {/* Lady Image in Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-50 pointer-events-none z-10 flex items-center justify-center">
                 <img src={cycleLady} alt="Cycle Syncing Lady" className="w-full h-full object-contain" />
            </div>

            {/* Icons Overlay (using absolute positioning to be on top of SVG) */}
            <div className="absolute inset-0 pointer-events-none">
                {phases.map((phase) => {
                     const pos = getArcCenter(center, center, radius, phase.startAngle, phase.endAngle);
                     // Adjust pos to map to percentage for div
                     const left = (pos.x / size) * 100;
                     const top = (pos.y / size) * 100;
                     const isActive = activePhase === phase.name;

                     return (
                         <div 
                            key={phase.name}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                            style={{ left: `${left}%`, top: `${top}%` }}
                         >
                             <div className={`rounded-full p-2 mb-1 ${isActive ? 'bg-white/20 backdrop-blur-sm' : ''}`}>
                                <PhaseIcon phase={phase.name} isActive={isActive} />
                             </div>
                             {/* Label */}
                             <div className={`text-xs text-center font-medium ${isActive ? 'opacity-100' : 'opacity-70'} transition-opacity`}>
                                 <span className="block text-gray-800">{phase.label}</span>
                                 <span className="block text-[10px] text-gray-500">{phase.days}</span>
                             </div>
                         </div>
                     )
                })}
            </div>
        </div>
    );
}
